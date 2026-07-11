FROM node:22-bookworm-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN npm install -g pnpm@11.10.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm db:generate && pnpm build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start"]
