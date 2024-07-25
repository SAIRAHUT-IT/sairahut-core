FROM node:20
WORKDIR /app
COPY ./package.json ./
COPY prisma ./prisma/

RUN yarn install
RUN npx prisma generate
RUN npx prisma db push

COPY . .
CMD ["yarn", "run", "start"]
