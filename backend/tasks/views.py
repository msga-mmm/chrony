from datetime import date

from rest_framework.decorators import action
from django.db.models import Case, BooleanField, When
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response

from .filters import TaskFilter
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = TaskFilter
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        base_queryset = Task.objects
        if self.action == 'restore':
            base_queryset = Task.all_objects
        elif self.request and self.request.query_params.get('is_deleted') is not None:
            base_queryset = Task.all_objects

        queryset = base_queryset.annotate(
            is_past_due=Case(
                When(due_date__lt=date.today(), done=False, then=True),
                default=False,
                output_field=BooleanField()
            )
        )

        return queryset

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        task = self.get_object()
        task.undelete()

        serializer = self.get_serializer(task)
        return Response(serializer.data)
