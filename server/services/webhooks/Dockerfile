FROM node:20-alpine AS base

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
WORKDIR /app

FROM base AS dev

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.base.json ./tsconfig.base.json

COPY services/webhooks/ ./services/webhooks/
COPY packages/core/ ./packages/core/

RUN npm ci --workspaces --include-workspace-root

RUN npm run push:core

FROM dev AS build

WORKDIR /app

COPY --from=dev /app/ .

RUN npm run build:core
RUN npm run build:webhooks

FROM build AS runtime

WORKDIR /app

COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/tsconfig.base.json ./tsconfig.base.json
COPY --from=build /app/packages/core/dist ./packages/core/
COPY --from=build /app/packages/core/package.json ./packages/core/

COPY --from=build /app/services/webhooks/dist ./services/webhooks/
COPY --from=build /app/services/webhooks/package.json ./services/webhooks/

COPY --from=build /app/package.json ./package.json

EXPOSE 4000

CMD ["npm", "run", "start:webhooks"]