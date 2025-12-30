from django.db import models
from safedelete.models import SafeDeleteModel

class Task(SafeDeleteModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    done = models.BooleanField(default=False)
    due_date = models.DateTimeField(blank=True, null=True)
