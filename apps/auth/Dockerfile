    FROM node:alpine AS development

    WORKDIR /usr/src/app
    
    COPY package.json ./
    COPY pnpm-lock.yaml ./
    COPY nest-cli.json ./
    COPY tsconfig.build.json ./
    COPY tsconfig.json ./
    COPY ../../proto ./proto
    
    RUN npm install -g pnpm
    RUN pnpm install
    
    COPY apps apps
    COPY libs libs
    COPY prisma prisma
    
    RUN pnpm exec prisma generate
    
    RUN pnpm run build auth
    
    FROM node:alpine AS production
    
    ARG NODE_ENV=production
    ENV NODE_ENV=${NODE_ENV}
    
    WORKDIR /usr/src/app
    
    COPY package.json ./
    COPY pnpm-lock.yaml ./
    RUN npm install -g pnpm
    RUN pnpm install --prod
    COPY ../../proto ./proto
    
    COPY --from=development /usr/src/app/dist ./dist
    
    CMD ["node", "dist/apps/auth/main"]
    