.PHONY: run-frontend
run-frontend:
	cd frontend && \
	bun run dev

.PHONY: format-frontend
format-frontend:
	cd frontend && \
	bun run format

.PHONY: run-backend
run-backend:
	cd backend && \
	uv run python manage.py runserver
