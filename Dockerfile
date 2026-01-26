FROM node:24.13.0-bullseye

EXPOSE  4200

WORKDIR /app

RUN npm install -g @angular/cli

CMD ["echo", "hello world"]
