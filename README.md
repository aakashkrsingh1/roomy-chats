# Roomy Chats

A full-stack real-time chat application with:

- **Frontend:** React + Vite (`front-chat/`)
- **Backend:** Spring Boot + MongoDB (`chat-app/`)
- **Docker Compose:** MongoDB + backend service in `chat-app/docker-compose.yml`

---

## Quick Full-Stack Setup

### 1. Start the backend stack

```bash
cd /Users/aakashkrsingh1/IdeaProjects/roomy-chats/chat-app
docker compose up --build
```

This starts:
- `mongo` on host port `27018`
- backend Spring Boot app on `http://localhost:8080`

If you prefer the legacy CLI:

```bash
docker-compose up --build
```

### 2. Start the frontend

```bash
cd /Users/aakashkrsingh1/IdeaProjects/roomy-chats/front-chat
npm install
VITE_BACKEND_BASE_URL=http://localhost:8080 npm run dev
```

Then open the URL shown by Vite (usually `http://localhost:5173`).

### 3. Build production outputs

Frontend build:

```bash
cd /Users/aakashkrsingh1/IdeaProjects/roomy-chats/front-chat
npm run build
```

Backend build:

```bash
cd /Users/aakashkrsingh1/IdeaProjects/roomy-chats/chat-app
./mvnw clean package
java -jar target/chat-app-0.0.1-SNAPSHOT.jar
```

---

## Frontend details (`front-chat/`)

### Important files
- `package.json` — npm scripts for `dev`, `build`, `preview`, and `lint`
- `src/config/AxiosHelper.js` — uses `VITE_BACKEND_BASE_URL` or defaults to `http://localhost:8080`
- `src/components/JoinCreateChat.jsx` — lobby form UI
- `src/components/ChatPage.jsx` — chat UI and WebSocket client

### Local env variables
Use `VITE_BACKEND_BASE_URL=http://localhost:8080` when running locally.

---

## Backend details (`chat-app/`)

### Important files
- `pom.xml` — Spring Boot dependencies and Java 21 build configuration
- `Dockerfile` — multi-stage build for a runnable `app.jar`
- `docker-compose.yml` — launches MongoDB and the backend together
- `src/main/resources/application.properties` — config values:
  - `spring.data.mongodb.uri=${SPRING_DATA_MONGODB_URI:${MONGODB_URI}}`
  - `spring.data.mongodb.database=chat-database`
  - `frontend.base.url=${FRONTEND_BASE_URL}`

### Default local backend environment
The backend expects env vars like:
- `SPRING_DATA_MONGODB_URI` (or `MONGODB_URI`)
- `FRONTEND_BASE_URL`

When using Docker Compose, `SPRING_DATA_MONGODB_URI` is already set to:

```text
mongodb://mongo:27017/chatapp
```

### Build and run locally without Docker

```bash
cd /Users/aakashkrsingh1/IdeaProjects/roomy-chats/chat-app
./mvnw clean package
java -jar target/chat-app-0.0.1-SNAPSHOT.jar
```

If you want local MongoDB, point env to your instance:

```bash
export SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/chatapp
export FRONTEND_BASE_URL=http://localhost:5173
```

---

## Docker notes

The backend Dockerfile builds a JAR and exposes port `8080`.
`chat-app/docker-compose.yml` also brings up MongoDB and the backend in a shared network.

## Environment example
The backend example env file is available at `chat-app/.env.example`.

## Notes

- Use `docker compose up --build` to run backend + database together.
- Use `VITE_BACKEND_BASE_URL=http://localhost:8080 npm run dev` to connect frontend to the local backend.
- The root README now contains the full guide in one place.




