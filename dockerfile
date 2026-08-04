FROM node:26-alpine

WORKDIR /src

RUN apk add --no-cache python3 make g++ && npm install -g corepack && corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["node", "--import", "tsx", "app.ts"]
