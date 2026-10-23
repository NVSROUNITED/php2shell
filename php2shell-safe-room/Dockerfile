FROM node:22-alpine
WORKDIR /room
COPY --chown=node:node index.html lab.css lab.js scenario.js server.cjs ./
USER node
ENV NODE_ENV=production PORT=8080
EXPOSE 8080
CMD ["node", "server.cjs"]
