import logging

from django.db import DatabaseError
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response

from .models import ContactMessage
from .serializers import ContactMessageSerializer
from .services import NotificationError, send_contact_notification
from .throttles import ContactBurstThrottle, ContactDailyThrottle

logger = logging.getLogger(__name__)

@api_view(['POST'])
@throttle_classes([ContactBurstThrottle, ContactDailyThrottle])
def contact(request):
    """Accept a contact form submission, store it, and notify by email."""
    serializer = ContactMessageSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        submission = serializer.save()
    except DatabaseError as exc:
        # A message is worth more than its stored copy, so fall back to an
        # unsaved one and let the email carry it. auto_now_add only fills in
        # submitted_at on save, and the email formats it, so set it here.
        logger.error("Contact submission could not be stored: %s", exc)
        submission = ContactMessage(
            **serializer.validated_data, submitted_at=timezone.now()
        )

    try:
        send_contact_notification(submission)
    except NotificationError as exc:
        logger.error(
            "Contact notification failed (submission id=%s): %s", submission.pk, exc
        )
        if submission.pk is None:
            # Neither stored nor sent: tell the visitor rather than pretend.
            return Response(
                {"detail": "Message could not be delivered. Please email me directly."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

    return Response({"status": "received"}, status=status.HTTP_201_CREATED)