# Stage 1 - build application
FROM node:10.16.0-alpine as node
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - serve static files
FROM nginx:alpine
COPY --from=node /usr/src/app/dist /usr/share/nginx/html
COPY ./outdated-browser.html /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
