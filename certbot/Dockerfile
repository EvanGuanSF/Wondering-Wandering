# Just get the default build from certbot.
# Commands will be given it to it from the compose file on container startup.
FROM certbot/certbot

WORKDIR /

# Add our existing credentials from certbot/openssl/etc.
ARG CERTBOT_YOUR_PRIMARY_SITE_DOMAIN
RUN mkdir -p /etc/letsencrypt/live/$CERTBOT_YOUR_PRIMARY_SITE_DOMAIN
COPY ssl_creds/* /etc/letsencrypt/live/$CERTBOT_YOUR_PRIMARY_SITE_DOMAIN/

# Create our web-root folder.
# Create the post-renewal hook file so that we can trigger a credential copy script
# to run after a successful crontab certbot renew run.
RUN mkdir -p /var/www/html /etc/letsencrypt/renewal-hooks/post
# Copy our .sh script.
WORKDIR /etc/letsencrypt/renewal-hooks/post
COPY certbot/copy_credentials.sh .
# Change the permissions of the file so that it can be executed.
RUN chmod +x ./copy_credentials.sh

# Make a new cron job that runs every few days that renews the certbot ssl credentials.
# Install cron on the system.
WORKDIR /
RUN apk update && apk update crontab
# Copy our pre-made crontab file.
COPY certbot/certbot-renew-crontab /etc/crontabs
# Change the permissions of the file so that it can be executed.
# Create a log for later use if needed.
# Execute the files.
RUN /bin/sh -c 'chmod +x /etc/crontabs/certbot-renew-crontab \
    && touch /var/log/cron.log \
    && crontab /etc/crontabs/certbot-renew-crontab >> /var/log/cron.log 2>&1'