FROM node:20-alpine

WORKDIR /app

# copy everything
COPY . ./

ENV OIDC_AUDIENCE "$OIDC_AUDIENCE"
ENV OIDC_URL "$OIDC_URL"
ENV OIDC_CLIENT_ID "$OIDC_CLIENT_ID"
ENV NODE_OPTIONS "--openssl-legacy-provider"

# first do the build
RUN yarn --frozen-lockfile \
  && yarn build \
  && rm -rf ./node_modules/ ./apps/**/node_modules/ \
  && yarn cache clean

# then, install required modules for the runtime
RUN yarn global add yarn-deduplicate patch-package \
  && yarn --production --frozen-lockfile \
  && yarn global remove yarn-deduplicate patch-package \
  && yarn cache clean

# some default environment variables
ENV PORT="8080"

EXPOSE 8080

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "/app/entrypoint.sh" ]
