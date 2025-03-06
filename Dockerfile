### STAGE 1: Run ###
FROM nginx:alpine
COPY ./dist/pazzioli-front/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf