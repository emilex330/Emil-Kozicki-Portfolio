"""Rate limits for the public contact form."""

from rest_framework.throttling import AnonRateThrottle


class ContactBurstThrottle(AnonRateThrottle):
    """Short-window limit: stops rapid-fire spam submissions."""

    scope = "contact_burst"


class ContactDailyThrottle(AnonRateThrottle):
    """Long-window limit: caps total submissions from one source per day."""

    scope = "contact_daily"