from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta

from rest_framework import status
from rest_framework.test import APITestCase

from .models import Task


class TaskAPITests(APITestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='StrongPassword123'
        )

        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='StrongPassword123'
        )

        self.task1 = Task.objects.create(
            user=self.user1,
            title='User 1 Task',
            description='Task for user 1',
            status='todo',
            due_date=timezone.now() + timedelta(days=2)
        )

        self.task2 = Task.objects.create(
            user=self.user2,
            title='User 2 Task',
            description='Task for user 2',
            status='done',
            due_date=timezone.now() + timedelta(days=2)
        )

    def authenticate_user1(self):
        self.client.force_authenticate(user=self.user1)

    def authenticate_user2(self):
        self.client.force_authenticate(user=self.user2)

    def test_register_user_successfully(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "StrongPassword123",
            "password2": "StrongPassword123"
        }

        response = self.client.post('/api/register/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], 'newuser')
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_register_fails_when_passwords_do_not_match(self):
        data = {
            "username": "baduser",
            "email": "bad@example.com",
            "password": "StrongPassword123",
            "password2": "WrongPassword123"
        }

        response = self.client.post('/api/register/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_fails_with_duplicate_username(self):
        data = {
            "username": "user1",
            "email": "another@example.com",
            "password": "StrongPassword123",
            "password2": "StrongPassword123"
        }

        response = self.client.post('/api/register/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthenticated_user_cannot_access_tasks(self):
        response = self.client.get('/api/tasks/')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_can_list_only_their_tasks(self):
        self.authenticate_user1()

        response = self.client.get('/api/tasks/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title'], 'User 1 Task')
        self.assertEqual(response.data['results'][0]['user'], 'user1')

    def test_user_cannot_access_another_users_task_detail(self):
        self.authenticate_user1()

        response = self.client.get(f'/api/tasks/{self.task2.id}/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_authenticated_user_can_create_task(self):
        self.authenticate_user1()

        data = {
            "title": "New private task",
            "description": "Created from test",
            "status": "todo",
            "due_date": "2026-07-10T12:00:00Z"
        }

        response = self.client.post('/api/tasks/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user'], 'user1')
        self.assertEqual(response.data['title'], 'New private task')

        task = Task.objects.get(title='New private task')
        self.assertEqual(task.user, self.user1)

    def test_task_title_must_be_at_least_3_characters(self):
        self.authenticate_user1()

        data = {
            "title": "a",
            "description": "Invalid title test",
            "status": "todo"
        }

        response = self.client.post('/api/tasks/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_stats_endpoint_returns_user_specific_counts(self):
        self.authenticate_user1()

        Task.objects.create(
            user=self.user1,
            title='Done Task',
            description='Done task',
            status='done',
            due_date=timezone.now() + timedelta(days=1)
        )

        Task.objects.create(
            user=self.user1,
            title='Overdue Task',
            description='Overdue task',
            status='todo',
            due_date=timezone.now() - timedelta(days=1)
        )

        response = self.client.get('/api/tasks/stats/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total'], 3)
        self.assertEqual(response.data['todo'], 2)
        self.assertEqual(response.data['done'], 1)
        self.assertEqual(response.data['overdue'], 1)