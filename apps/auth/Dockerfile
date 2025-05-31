# ---------- Development Stage ----------
    FROM node:alpine AS development

    WORKDIR /usr/src/app
    
    # Copy root-level config
    COPY package.json ./
    COPY pnpm-lock.yaml ./
    COPY nest-cli.json ./
    COPY tsconfig.build.json ./
    COPY tsconfig.json ./
    
    # Install dependencies
    RUN npm install -g pnpm
    RUN pnpm install
    
    # Copy full monorepo (context phải là thư mục root!)
    COPY apps apps
    COPY libs libs
    COPY prisma prisma
    
    # Generate Prisma client (if needed)
    RUN pnpm exec prisma generate
    
    # Build only `auth` service
    RUN pnpm run build auth
    
    # ---------- Production Stage ----------
    FROM node:alpine AS production
    
    ARG NODE_ENV=production
    ENV NODE_ENV=${NODE_ENV}
    
    WORKDIR /usr/src/app
    
    COPY package.json ./
    COPY pnpm-lock.yaml ./
    RUN npm install -g pnpm
    RUN pnpm install --prod
    
    # Copy built dist + Prisma client
    COPY --from=development /usr/src/app/dist ./dist
    COPY --from=development /usr/src/app/node_modules ./node_modules
    
    CMD ["node", "dist/apps/auth/main"]
    