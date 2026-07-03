from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from rest_framework.permissions import IsAuthenticated

from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import TaskSerializer, UserRegisterSerializer
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = ['status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'title']

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        tasks = self.get_queryset()
        now = timezone.now()

        data = {
            "total": tasks.count(),
            "todo": tasks.filter(status='todo').count(),
            "in_progress": tasks.filter(status='in_progress').count(),
            "done": tasks.filter(status='done').count(),
            "overdue": tasks.filter(
                due_date__lt=now
            ).exclude(status='done').count(),
        }

        return Response(data)

class RegisterView(generics.CreateAPIView):
        serializer_class = UserRegisterSerializer
        permission_classes = [AllowAny]