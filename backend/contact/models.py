from django.db import models

class ContactMessage(models.Model):
    """A message submitted through the site's contact form."""

    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField(max_length=2000)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.name} <{self.email}> ({self.submitted_at:%Y-%m-%d})"
