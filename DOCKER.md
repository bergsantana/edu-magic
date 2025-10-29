# Docker Setup for edu-magic

This project includes Docker configuration for easy development and deployment.

## Files Created

- `docker-compose.yml` - Main Docker Compose configuration
- `Dockerfile` - Production Docker image
- `Dockerfile.dev` - Development Docker image with hot-reloading
- `.dockerignore` - Files to exclude from Docker build context
- `.env.docker` - Example environment variables for Docker

## Quick Start

### Production Setup

1. Build and run the application:
```bash
docker-compose up --build
```

2. The application will be available at `http://localhost:3000`
3. PostgreSQL will be available at `localhost:5432`

### Development Setup

1. Run the development version with hot-reloading:
```bash
docker-compose --profile dev up app-dev --build
```

2. The development server will be available at `http://localhost:3001`

## Database Setup

The Docker Compose file includes a PostgreSQL database. To set up the database schema:

1. Run Prisma migrations:
```bash
# If containers are running
docker-compose exec app npx prisma migrate deploy

# Or run migrations during startup by adding to your Dockerfile
```

## Environment Variables

Copy `.env.docker` to `.env` and modify as needed:
```bash
cp .env.docker .env
```

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment mode (development/production)

## Useful Commands

### View logs
```bash
docker-compose logs app
docker-compose logs postgres
```

### Access container shell
```bash
docker-compose exec app sh
docker-compose exec postgres psql -U edu_magic_user -d edu_magic
```

### Reset database
```bash
docker-compose down -v  # Remove volumes
docker-compose up --build
```

### Production deployment
```bash
# Build production image
docker-compose build app

# Run in detached mode
docker-compose up -d
```

## Notes

- The development version (`app-dev`) includes volume mounting for hot-reloading
- PostgreSQL data is persisted in a Docker volume
- The production image uses Next.js standalone output for optimal performance
- Health checks ensure the database is ready before starting the application