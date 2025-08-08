# Roomy Chats

A real-time chat application with:

- **Frontend**: React + Vite (`/frontend`)
- **Backend**: Spring Boot + MongoDB (`/backend`)

## Getting Started

See `front-chat/README.md` and `chat-app/README.md` for setup instructions.

## Check this out: 
https://roomy-chats.vercel.app/

## 🚀 Deployment Info

### 🖥️ Frontend  
- **Hosted On:** [Vercel](https://vercel.com)  
- **Tech Stack:** Vite + React  
- **Deployment Flow:**  
  - Automatically deployed from the `front-chat` folder of the `main` branch.  
  - Uses [Vercel Dashboard](https://vercel.com/dashboard) for project configuration.  
  - Environment variables like `VITE_BACKEND_BASE_URL` are managed securely via Vercel project settings.  

### ⚙️ Backend  
- **Hosted On:** [Render](https://render.com)  
- **Tech Stack:** Spring Boot (Java)  
- **Containerized Using:** Docker  
- **Deployment Flow:**  
  - GitHub Actions workflow builds and pushes a Docker image to Docker Hub whenever changes are pushed to `main`.  
  - Render is configured to automatically pull the latest image from Docker Hub and redeploy the backend.  
  - Environment variables such as MongoDB URI and CORS origins are managed via the Render Dashboard.
## Screenshots: 
- **./**
  - <img width="1517" height="1167" alt="image" src="https://github.com/user-attachments/assets/f1f91f3b-250f-41d6-8d7e-e6e606c33014" />
- **./chat**
  - <img width="1517" height="1167" alt="image" src="https://github.com/user-attachments/assets/feb2fe14-c513-495f-9d67-77e2cd96cc8c" />




