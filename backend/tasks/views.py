from datetime import date

from django.db.models import Case, BooleanField, When
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter

from .filters import TaskFilter
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.annotate(
        is_past_due=Case(
            When(due_date__lt=date.today(), done=False, then=True),
            default=False,
            output_field=BooleanField()
        )
    ).all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = TaskFilter
    ordering_fields = ['created_at']
    ordering = ['-created_at']
