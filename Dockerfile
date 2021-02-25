FROM node:14.15.5-alpine AS base

WORKDIR /clinwiki-notify

# ---------- Builder ----------
# Creates:
# - node_modules: production dependencies (no dev dependencies)
# - dist: A production build compiled with Babel
FROM base AS builder

COPY package*.json .babelrc.json ./

RUN npm install

COPY ./src ./src

RUN npm run build

# ---------- Release ----------
FROM base AS release

COPY --from=builder /clinwiki-notify/node_modules ./node_modules
COPY --from=builder /clinwiki-notify/dist ./dist

CMD ["node", "./dist/server.js"]

#RUN mkdir -p /clinwiki-notify
#WORKDIR /clinwiki-notify
#COPY . .
#RUN npm install
#RUN npm run build
#CMD ["npm", "start"]
