# Chatbot with Ollama
Welcome to Chatbot, powered by Ollama and built with ElysiaJS, a Bun based backend server that delivers extra-ordinary performance and even faster than Expressjs.

## Getting Started
To get started with this server, you will need to install 2 things installed into system
- Bun
- Docker

Once installed, run these commands for preparation:
```bash
docker-compose up -d

bun install
bunx prisma migrate dev
bunx prisma generate
```

## Run the server
To start the server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

## Swagger API Documentation
When server is running, go to http://localhost:3000/swagger for refering API
