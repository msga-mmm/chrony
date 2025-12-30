from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    is_past_due = serializers.BooleanField(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'done', 'due_date', 'created_at', 'is_past_due', 'deleted']
