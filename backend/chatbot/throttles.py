"""Rate limits for the public chat endpoint."""

from rest_framework.throttling import AnonRateThrottle


class ChatBurstThrottle(AnonRateThrottle):
    """Short-window limit: stops rapid-fire scripted abuse."""

    scope = "chat_burst"


class ChatDailyThrottle(AnonRateThrottle):
    """Long-window limit: stops slow-drip quota drain."""

    scope = "chat_daily"
