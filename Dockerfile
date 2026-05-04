FROM nginx:alpine

COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# envsubst nahradí __ADMIN_PASSWORD__ skutečným heslem z env proměnné při startu
RUN apk add --no-cache bash

EXPOSE 80

CMD ["/bin/sh", "-c", \
  "sed -i \"s|__ADMIN_PASSWORD__|${ADMIN_PASSWORD:-changeme}|g\" /usr/share/nginx/html/admin.html && \
   nginx -g 'daemon off;'"]
