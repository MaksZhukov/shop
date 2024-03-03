FROM node:18.0.0-alpine
RUN apk --no-cache add git
RUN git clone https://github.com/MaksZhukov/shop.git
WORKDIR /shop
RUN git reset --hard
RUN npm install -f
COPY .env.production.local ./
ENV NODE_ENV production
EXPOSE 3000
CMD npm run build && node server.js