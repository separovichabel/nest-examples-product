FROM node:16-alpine as builder

WORKDIR /home/node

COPY . .

RUN yarn && yarn build && rm -rf node_modules && yarn install --prod

# ---

FROM node:16-alpine

WORKDIR /home/node
COPY --from=builder /home/node/dist/ /home/node/
COPY --from=builder /home/node/node_modules /home/node/node_modules

CMD ["node", "/home/node/main.js"]