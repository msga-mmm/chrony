# Project Handover Document: Chrony

This document provides an overview of the `Chrony` project, including its structure, key technologies, development workflows, and essential components. It is intended to help new developers quickly get up to speed with the project.

## 1. Project Overview

`Chrony` is a tasks manager application with a frontend built using React and a backend powered by Django REST Framework.

## 2. Project Structure

The project is divided into two main parts:

*   `frontend/`: Contains the React application.
*   `backend/`: Contains the Django REST Framework application.

```
.
├── backend/
│   ├── chrony/             # Main Django project configuration
│   │   ├── settings.py     # Project settings
│   │   ├── urls.py         # Main URL routing
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── tasks/              # Django app for task management
│   │   ├── models.py       # Defines the Task model
│   │   ├── views.py        # Handles API logic for tasks (TaskViewSet)
│   │   ├── serializers.py  # Serializes Task data
│   │   ├── admin.py
│   │   ├── tests.py
│   │   └── apps.py
│   ├── manage.py           # Django's command-line utility
│   ├── pyproject.toml      # Backend dependencies
│   └── uv.lock             # UV lock file
├── frontend/
│   ├── public/             # Static assets
│   ├── src/                # Frontend source code
│   │   ├── main.tsx        # Main entry point for React app
│   │   ├── routeTree.gen.ts # Generated routing configuration
│   │   └── styles.css      # Global styles
│   ├── package.json        # Frontend dependencies and scripts
│   ├── bun.lock            # Bun lock file
│   ├── prettier.config.js
│   ├── eslint.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
└── README.md
```

## 3. Technologies Used

### Frontend

*   **Framework**: React 19
*   **Build Tool**: Vite
*   **Package Manager**: Bun
*   **Routing**: TanStack Router
*   **Data Fetching**: TanStack Query
*   **Styling**: Material-UI (MUI), Tailwind CSS
*   **Language**: TypeScript
*   **Testing**: Vitest, React Testing Library
*   **Linting/Formatting**: ESLint, Prettier

### Backend

*   **Framework**: Django 5.x
*   **REST API**: Django REST Framework
*   **Database**: SQLite3 (development, configured in `settings.py`)
*   **Package Manager**: UV
*   **CORS Handling**: `django-cors-headers`
*   **Language**: Python 3.12+

## 4. Development Workflow

### Getting Started

1.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd chrony
    ```

2.  **Frontend Setup**:
    ```bash
    cd frontend
    bun install
    bun run dev
    ```
    The frontend application will typically run on `http://localhost:3000`.

3.  **Backend Setup**:
    ```bash
    cd backend
    uv install
    uv run python manage.py migrate # Apply database migrations
    uv run python manage.py runserver
    ```
    The backend API will typically run on `http://localhost:8000`.

### Key Development Commands

#### Frontend (`frontend/` directory)

*   **Install Dependencies**: `bun install`
*   **Run Development Server**: `bun run dev` or `bun run start`
*   **Build for Production**: `bun run build`
*   **Serve Production Build**: `bun run serve`
*   **Run Tests**: `bun run test`
*   **Lint**: `bun run lint`
*   **Format**: `bun run format`
*   **Format and Lint Fix**: `bun run check`

#### Backend (`backend/` directory)

*   **Install Dependencies**: `uv install`
*   **Run Development Server**: `uv run python manage.py runserver`
*   **Apply Migrations**: `uv run python manage.py migrate`
*   **Create Superuser (for Admin access)**: `uv run python manage.py createsuperuser`
*   **Run Tests**: `uv run python manage.py test tasks` (assuming `pytest` is not explicitly set up, Django's built-in test runner for the `tasks` app)

## 5. Main Components and Entry Points

### Frontend

*   **Entry Point**: `frontend/src/main.tsx` - Initializes the React application, sets up TanStack Router and TanStack Query.
*   **Routing**: `frontend/src/routeTree.gen.ts` - Automatically generated route configuration based on file-system routing.
*   **API Communication**: Uses `axios` for HTTP requests to the backend API.

### Backend

*   **Main Application**: `backend/manage.py` - Django's command-line utility for administrative tasks.
*   **Project Settings**: `backend/chrony/settings.py` - Central configuration for the Django project, including installed apps, database settings (SQLite3 by default), and CORS origins (`http://localhost:3000`).
*   **URL Routing**: `backend/chrony/urls.py` - Defines the main URL patterns. It includes the Django admin (`/admin/`) and routes API requests to the `tasks` application under `/api/` using `djangorestframework`'s `DefaultRouter`.
*   **Tasks Application (`backend/tasks/`)**:
    *   `models.py`: Defines the `Task` model, which is the core data structure (title, created_at, done, due_date).
    *   `views.py`: Contains `TaskViewSet`, a `ModelViewSet` that provides CRUD operations for `Task` objects via the REST API. It uses `TaskSerializer` and orders results by `created_at` descending.
    *   `serializers.py`: Defines `TaskSerializer`, responsible for converting `Task` model instances to/from JSON format for API communication.

## 6. Database

*   **Type**: SQLite3 (default for development).
*   **Location**: `db.sqlite3` in the `backend/` directory.
*   **Migrations**: Database schema changes are managed via Django migrations. Run `uv run python manage.py makemigrations` and `uv run python manage.py migrate` to apply schema changes.

## 7. API Endpoints

The backend exposes RESTful API endpoints for tasks under `/api/tasks/`.

*   `GET /api/tasks/`: Retrieve a list of tasks.
*   `POST /api/tasks/`: Create a new task.
*   `GET /api/tasks/{id}/`: Retrieve a specific task by ID.
*   `PUT /api/tasks/{id}/`: Update a specific task by ID.
*   `PATCH /api/tasks/{id}/`: Partially update a specific task by ID.
*   `DELETE /api/tasks/{id}/`: Delete a specific task by ID.

## 8. Frontend-Backend Communication

The frontend (running on `http://localhost:3000`) communicates with the backend API (running on `http://localhost:8000`). CORS is configured in `backend/chrony/settings.py` to allow requests from the frontend origin.

## 9. Future Considerations / TODOs

*   **Environment Variables**: `CORS_ALLOWED_ORIGINS` in `backend/chrony/settings.py` is hardcoded. It should be moved to an environment variable for production deployments.
*   **Authentication/Authorization**: Currently, there's no explicit user authentication or authorization implemented for the API.
*   **Advanced Filtering/Search**: Extend API with more advanced filtering or search capabilities for tasks if needed.
*   **Error Handling**: Enhance error handling and user feedback in both frontend and backend.
*   **Testing**: Expand test coverage for both frontend and backend.

This document should serve as a solid starting point for anyone taking over the development of `Chrony`. Good luck!

