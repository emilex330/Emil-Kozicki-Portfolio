import logging

from rest_framework import status
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response

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
    submission = serializer.save()

    try:
        send_contact_notification(submission)
    except NotificationError as exc:
        logger.error(
            "Contact notification failed (submission id=%s): %s", submission.pk, exc
        )

    return Response({"status": "received"}, status=status.HTTP_201_CREATED)