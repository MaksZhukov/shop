FROM node:18.17.0-alpine
RUN apk --no-cache add git
RUN git clone https://github.com/MaksZhukov/shop.git
WORKDIR /shop
RUN npm install -f
ENV NODE_ENV production
EXPOSE 3000
CMD npm run build && node server.js