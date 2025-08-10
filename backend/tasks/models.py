from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    done = models.BooleanField(default=False)
