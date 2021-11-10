###
# STAGE 1: Build React app in temp container.
###
FROM node:16 as build-react-app

WORKDIR /temp/app

COPY ./app/package*.json ./

RUN apt-get update
RUN npm update -g npm
RUN npm install -g node-gyp npm-check-updates
RUN ncu -u
RUN npm install

COPY ./app/ /temp/app/

WORKDIR /temp/app/
RUN npm run build --prod

###
# STAGE 2: Use created react build in nginx container.
###
FROM nginx

# Copy the React build to a .env specified folder.
COPY --from=build-react-app /temp/app/build/ /var/www/app/

WORKDIR /tmp

# Make a new cron job that runs every few hours that reloads nginx.
# Install cron on the system.
# RUN apt-get update && apt-get -y install cron
# Copy our pre-made crontab file.
# COPY ./nginx/nginx-reload-crontab /etc/cron.d/nginx-reload-crontab
# Change the permissions of the file so that it can be executed.
# Create a log for later use if needed.
# Execute the files.
#RUN /bin/bash -c 'chmod 0644 /etc/cron.d/nginx-reload-crontab \
#    && touch /var/log/cron.log \
#    && crontab /etc/cron.d/nginx-reload-crontab >> /var/log/cron.log 2>&1'

# Remove the nginx .conf files if they exist, then make empty placeholders for the envsubst.
#RUN /bin/bash -c 'rm -f /etc/nginx/conf.d/nginx.conf /etc/nginx/conf.d/snippets/ssl-params.conf \
#    && mkdir -p /etc/nginx/conf.d/ /etc/nginx/conf.d/snippets/ \
#    && touch /etc/nginx/conf.d/nginx.conf /etc/nginx/conf.d/snippets/ssl-params.conf'
    