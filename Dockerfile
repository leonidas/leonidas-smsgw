FROM node:8
RUN groupadd smsgw && useradd -g smsgw smsgw
COPY package.json yarn.lock /usr/src/app/
WORKDIR /usr/src/app
RUN yarn install --pure-lockfile && chmod -R ugo+r node_modules && rm -rf /root/.yarn-cache
COPY . /usr/src/app/
USER smsgw
EXPOSE 3000

# to make it reachable from outside container
ENV SMSGW_LISTEN_ADDRESS=0.0.0.0

CMD ["node", "index.js"]
