from django_filters import rest_framework as filters

from .models import Task

class TaskFilter(filters.FilterSet):
    is_past_due = filters.BooleanFilter()
    is_deleted = filters.BooleanFilter(field_name='deleted', lookup_expr='isnull', exclude=True)

    class Meta:
        model = Task
        fields = ['done', 'is_past_due', 'is_deleted']
