import logging

from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response

from .serializers import ContactMessageSerializer
from .throttles import ContactBurstThrottle, ContactDailyThrottle

logger = logging.getLogger(__name__)


@api_view(['POST'])
@throttle_classes([ContactBurstThrottle, ContactDailyThrottle])
def contact(request):
    """Accept a contact form submission, store it, and notify by email."""
    serializer = ContactMessageSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    submission = serializer.save()

    try:
        send_mail(
            subject=f"Portfolio contact from {submission.name}",
            message=(
                f"From: {submission.name} <{submission.email}>\n"
                f"Sent: {submission.submitted_at:%Y-%m-%d %H:%M} UTC\n\n"
                f"{submission.message}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_NOTIFY_EMAIL],
            fail_silently=False,
        )
    except Exception:
        logger.exception("Contact email failed to send (submission id=%s)", submission.pk)

    return Response({"status": "received"}, status=status.HTTP_201_CREATED)