FROM keymetrics/pm2:14-alpine
RUN mkdir -p /clinwiki-notify
WORKDIR /clinwiki-notify
COPY . .
RUN npm install
RUN pm2 install pm2-logrotate
#CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
CMD ["npm", "start"]
