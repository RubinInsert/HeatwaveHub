FROM node:20-alpine

# Install pnpm globally inside container
RUN npm install -g pnpm

WORKDIR /app

# Only copy package files first (to cache the npm install layer)
COPY package*.json ./
RUN pnpm install

# Copy the rest of your files
COPY . .

RUN pnpm exec prisma generate


# In development, we don't 'build'—we just run the dev server
EXPOSE 3000