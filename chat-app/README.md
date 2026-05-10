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
