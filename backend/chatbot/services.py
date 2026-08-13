"""Handles communication with the Google Gemini API."""

import logging

from django.conf import settings
from google import genai
from google.genai import errors

from .prompts import build_system_prompt

logger = logging.getLogger(__name__)

# The SDK raises from two hierarchies: a public one, and a private one used by
# the interactions API. Import the private base defensively -- if a future SDK
# version moves it, we simply fall through to the generic handler below.
_SDK_ERRORS = [errors.APIError]
try:
    from google.genai._gaos.lib.compat_errors import GeminiNextGenAPIClientError
except ImportError:
    pass
else:
    _SDK_ERRORS.append(GeminiNextGenAPIClientError)
_SDK_ERRORS = tuple(_SDK_ERRORS)

# Quota/rate-limit errors get their own handling so visitors see an honest
# "daily limit reached" message instead of a generic failure.
_QUOTA_ERRORS = ()
try:
    from google.genai._gaos.lib.compat_errors import RateLimitError
except ImportError:
    pass
else:
    _QUOTA_ERRORS = (RateLimitError,)



_client = None


class LLMUnavailable(Exception):
    """Raised when the language model cannot be reached or returns nothing."""

class LLMQuotaExceeded(LLMUnavailable):
    """Raised when the API quota for the day has been exhausted."""

def get_client():
    """Return a single shared Gemini client, created on first use."""
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


def _text_turn(turn_type, text):
    """Build one conversation turn in the format the Gemini API expects."""
    return {"type": turn_type, "content": [{"type": "text", "text": text}]}


def _wrap(text):
    """Wrap untrusted visitor text so the model treats it as data, not instructions."""
    cleaned = text.replace("<visitor_message>", "").replace("</visitor_message>", "")
    return f"<visitor_message>\n{cleaned}\n</visitor_message>"


def call_llm(message, history=None):
    """Send a visitor message to Gemini and return the text reply.

    Raises LLMUnavailable if the model cannot be reached or returns nothing.
    """
    turns = []
    for turn in history or []:
        if turn["role"] == "user":
            turns.append(_text_turn("user_input", _wrap(turn["content"])))
        else:
            turns.append(_text_turn("model_output", turn["content"]))
    turns.append(_text_turn("user_input", _wrap(message)))

    try:
        interaction = get_client().interactions.create(
            model=settings.GEMINI_MODEL,
            system_instruction=build_system_prompt(),
            input=turns,
            store=False,
            generation_config={
                "max_output_tokens": settings.CHAT_MAX_TOKENS,
                "thinking_level": "minimal",
            },
        )
    except _QUOTA_ERRORS as exc:
        logger.warning("Gemini quota exceeded")
        raise LLMQuotaExceeded from exc
    except _SDK_ERRORS as exc:
        logger.warning("Gemini API error: %s", type(exc).__name__)
        raise LLMUnavailable from exc
    except Exception as exc:
        logger.exception("Unexpected error calling Gemini")
        raise LLMUnavailable from exc

    reply = interaction.output_text
    if not reply:
        logger.warning("Gemini returned an empty reply")
        raise LLMUnavailable

    return reply