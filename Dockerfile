# Use Node 18 Alpine
FROM node:18-alpine

WORKDIR /app

# Copy package and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
