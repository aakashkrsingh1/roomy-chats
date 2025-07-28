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
## Demo: 


<video src="https://github.com/user-attachments/assets/fea7ab57-3602-47ff-87aa-84abfeda69bd"></video>

