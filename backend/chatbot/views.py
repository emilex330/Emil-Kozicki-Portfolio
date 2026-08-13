from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import ChatRequestSerializer
from .services import LLMQuotaExceeded, LLMUnavailable, call_llm
from .throttles import ChatBurstThrottle, ChatDailyThrottle


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint to verify that the API is running.
    """
    return Response({"status": "ok"})


@api_view(['POST'])
@throttle_classes([ChatBurstThrottle, ChatDailyThrottle])
def chat(request):
    """Answer a visitor question about Emil using the LLM."""
    serializer = ChatRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        reply = call_llm(
            serializer.validated_data["message"],
            serializer.validated_data["history"],
        )
    except LLMQuotaExceeded:
        return Response(
            {"error": "quota_exceeded"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    except LLMUnavailable:
        return Response(
            {"error": "service_unavailable"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    return Response({"reply": reply})