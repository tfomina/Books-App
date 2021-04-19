FROM node:lts as node

WORKDIR /app

COPY src/package*.json ./
RUN npm install
COPY src/ ./

EXPOSE 3000

CMD ["node", "index.js"]