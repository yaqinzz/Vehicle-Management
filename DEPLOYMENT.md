# CI/CD & Deployment

What this workflow does

- Runs backend tests and builds backend
- Builds frontend
- Builds and pushes Docker images to Docker Hub
- SSH to VPS and runs `docker-compose pull` + `docker-compose up -d`

Repository secrets required (add in GitHub Settings -> Secrets):

- DOCKERHUB_USERNAME: your Docker Hub username
- DOCKERHUB_TOKEN: Docker Hub access token/password
- SSH_HOST: VPS IP or hostname
- SSH_USER: user to SSH as (must have docker privileges)
- SSH_PRIVATE_KEY: private key content for SSH auth (no passphrase recommended)
- SSH_PORT (optional): SSH port (defaults to 22)

Server-side setup (on VPS)

1. Ensure Docker and docker-compose are installed and the SSH user can run docker commands.
2. Create a `docker-compose.yml` on the server in your deploy path. Example (server):

--- example server `docker-compose.yml` ---
version: '3.8'
services:
backend:
image: DOCKERHUB_USERNAME/vehicle-management-backend:latest
restart: always
env_file: ./backend.env
ports: - '4000:4000'
depends_on: - postgres

frontend:
image: DOCKERHUB_USERNAME/vehicle-management-frontend:latest
restart: always
ports: - '5173:5173'

postgres:
image: postgres:15-alpine
environment:
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
POSTGRES_DB: vehicle_db
volumes: - db-data:/var/lib/postgresql/data

volumes:
db-data:

---

Notes

- Replace `DOCKERHUB_USERNAME` with your Docker Hub user in the server file or use automated templating.
- For zero-downtime deployment consider using a load balancer or blue/green deployment strategy.
