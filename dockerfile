FROM node:26-alpine

WORKDIR /src

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["node", "--import", "tsx", "app.ts"]
