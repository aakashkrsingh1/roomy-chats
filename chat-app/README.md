# Backend — Roomy Chats

This is the backend service for Roomy Chats, built with Spring Boot and MongoDB.

## Run locally with Docker Compose

```bash
cd /Users/aakashkrsingh1/IdeaProjects/roomy-chats/chat-app
docker compose up --build
```

The compose stack starts:
- MongoDB on host port `27018`
- Spring Boot backend on `http://localhost:8080`

## Run locally without Docker

```bash
cd /Users/aakashkrsingh1/IdeaProjects/roomy-chats/chat-app
./mvnw clean package
java -jar target/chat-app-0.0.1-SNAPSHOT.jar
```

### Recommended local env

```bash
export SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/chatapp
export FRONTEND_BASE_URL=http://localhost:5173
```

## Important files

- `pom.xml` — dependencies and Maven build configuration
- `Dockerfile` — builds the Spring Boot JAR and runs it on port `8080`
- `docker-compose.yml` — launches MongoDB and the backend together
- `src/main/resources/application.properties` — application configuration

## Notes

- `application.properties` resolves MongoDB URI from `SPRING_DATA_MONGODB_URI` or `MONGODB_URI`.
- For frontend integration, use `VITE_BACKEND_BASE_URL=http://localhost:8080` in the frontend run environment.

## Deployment notes

### Render
- Use the existing `Dockerfile` and deploy the backend as a Render Web Service.
- Set the service to build from the repo root `chat-app` directory.
- Add environment variables:
  - `SPRING_DATA_MONGODB_URI` with your MongoDB Atlas connection URI
  - `APP_BASE_URL` to the Render service URL if needed
  - `JWT_SECRET` if you want to override the default sign-in secret
- Render will build with Java 21 from the Dockerfile automatically.

### MongoDB Atlas
- Use a shared cluster tier (`M0`, `M2`, or `M5`) for a non-pausing database.
- Configure a database user in Atlas and add network access for your backend IP or `0.0.0.0/0` for development.
- Copy the `mongodb+srv://...` connection string into `SPRING_DATA_MONGODB_URI`.

### UptimeRobot keepalive
- Use a free UptimeRobot monitor to ping the backend health endpoint:
  - `https://<your-backend-service>/health`
- This endpoint performs a lightweight MongoDB access and keeps the database path warm.

### API docs
- OpenAPI docs are available at:
  - `/swagger-ui.html`
  - `/v3/api-docs`
