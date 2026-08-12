from rest_framework import serializers

from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    """Validates a contact form submission and can save it to the database."""

    class Meta:
        model = ContactMessage
        fields = ["name", "email", "message"]