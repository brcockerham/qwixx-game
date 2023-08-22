FROM --platform=linux/amd64 node:19.0.0-alpine3.16 as builder

ADD . /app
WORKDIR /app/client
RUN yarn install
RUN yarn build

WORKDIR /app
RUN yarn install
ENV NODE_ENV=production
RUN yarn build
RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

FROM gcr.io/distroless/nodejs18-debian11

COPY --from=builder /app/client/build /app/client/build
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/server.js /app/server.js

WORKDIR /app
EXPOSE 9000
CMD ["server.js"]
