FROM node:lts-slim AS build
WORKDIR /src
RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm ci

COPY . ./
RUN ng build --configuration=production

FROM nginx:stable AS final
EXPOSE 80
COPY --from=build /src/dist/sebania-web/browser /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
