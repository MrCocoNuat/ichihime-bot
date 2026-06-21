FROM node:20-alpine

WORKDIR /app

# Copy dependency files first for layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the source
COPY . .
RUN chown -R node:node /app

# Run as non-root user for security
USER node

CMD ["node", "bot.js"]
