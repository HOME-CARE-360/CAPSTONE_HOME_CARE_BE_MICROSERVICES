
    FROM node:alpine AS development

    WORKDIR /usr/src/app
    
    COPY package.json ./
    COPY pnpm-lock.yaml ./
    COPY nest-cli.json ./
    COPY tsconfig.build.json ./
    COPY tsconfig.json ./
    RUN npm install -g pnpm

    COPY prisma prisma
    RUN pnpm install
    RUN pnpm exec prisma generate
    COPY apps/manager apps/manager
    COPY libs libs

    
 
    
    RUN pnpm run build manager
    
    FROM node:alpine AS production
    
    ARG NODE_ENV=production
    ENV NODE_ENV=${NODE_ENV}
    
    WORKDIR /usr/src/app
    
    COPY package.json ./
    COPY pnpm-lock.yaml ./
    RUN npm install -g pnpm
    RUN pnpm install --prod
    

    COPY --from=development /usr/src/app/dist ./dist
    COPY proto proto
    CMD ["node", "dist/apps/manager/main"]
    