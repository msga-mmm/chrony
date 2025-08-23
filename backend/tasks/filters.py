from django_filters import rest_framework as filters

from .models import Task

class TaskFilter(filters.FilterSet):
    is_past_due = filters.BooleanFilter()

    class Meta:
        model = Task
        fields = ['done', 'is_past_due']
