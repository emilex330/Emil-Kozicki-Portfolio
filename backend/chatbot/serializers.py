"""Validates incoming chat requests."""

from django.conf import settings
from rest_framework import serializers


class HistoryTurnSerializer(serializers.Serializer):
    """One prior turn in the conversation."""

    role = serializers.ChoiceField(choices=["user", "assistant"])
    content = serializers.CharField(max_length=settings.CHAT_MAX_MESSAGE_CHARS)


class ChatRequestSerializer(serializers.Serializer):
    """The body of a POST to /api/chat/."""

    message = serializers.CharField(
        min_length=1,
        max_length=settings.CHAT_MAX_MESSAGE_CHARS,
        trim_whitespace=True,
    )
    history = HistoryTurnSerializer(many=True, required=False, default=list)

    def validate_history(self, value):
        """Keep only the most recent turns, however many the client sent."""
        return value[-settings.CHAT_MAX_HISTORY_TURNS:]
