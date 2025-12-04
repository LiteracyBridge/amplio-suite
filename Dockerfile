FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

# install project dependencies
RUN yarn --frozen-lockfile

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=5001
ENV PORT=${PORT}

RUN \
  if [ "${NODE_ENV}" == "production" ]; then \
    npm run build:production; \
  else \
    npm run build:staging; \
  fi

EXPOSE ${PORT}

CMD [ "http-server", "dist/" ]
