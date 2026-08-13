"""Sends contact notifications through the Resend HTTPS API.

Outbound SMTP is blocked on most cloud hosts, so notifications go over
ordinary HTTPS instead of a mail connection.
"""

import httpx
from django.conf import settings

RESEND_ENDPOINT = "https://api.resend.com/emails"


class NotificationError(Exception):
    """Raised when the notification email could not be sent."""


def send_contact_notification(submission):
    """Email the site owner about a new contact submission."""
    if not settings.RESEND_API_KEY:
        raise NotificationError("RESEND_API_KEY is not configured")

    body = (
        f"From: {submission.name} <{submission.email}>\n"
        f"Sent: {submission.submitted_at:%Y-%m-%d %H:%M} UTC\n\n"
        f"{submission.message}"
    )

    try:
        response = httpx.post(
            RESEND_ENDPOINT,
            headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}"},
            json={
                "from": settings.RESEND_FROM_EMAIL,
                "to": [settings.CONTACT_NOTIFY_EMAIL],
                "reply_to": submission.email,
                "subject": f"Portfolio contact from {submission.name}",
                "text": body,
            },
            timeout=10,
        )
    except httpx.HTTPError as exc:
        raise NotificationError("could not reach Resend") from exc

    if response.status_code >= 400:
        raise NotificationError(f"Resend returned HTTP {response.status_code}")