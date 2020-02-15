# Just get the default build from certbot.
# Commands will be given it to it from the compose file on container startup.
FROM certbot/certbot

WORKDIR /

# Create our web-root folder.
RUN mkdir -p /var/www/html
# Create the post-renewal hook file so that we can trigger a credential copy script
# to run after a successful crontab certbot renew run.
RUN mkdir -p /etc/letsencrypt/renewal-hooks/post
# Copy our .sh script.
COPY copy_credentials.sh /etc/letsencrypt/renewal-hooks/post
# Change the permissions of the file so that it can be executed.
RUN chmod +x /etc/letsencrypt/renewal-hooks/post/copy_credentials.sh

# Make a new cron job that runs every few days that renews the certbot ssl credentials.
# Install cron on the system.
RUN apk update && apk update crontab
# Copy our pre-made crontab file.
COPY certbot-renew-crontab /etc/crontabs
# Change the permissions of the file so that it can be executed.
RUN chmod +x /etc/crontabs/certbot-renew-crontab
# Create a log for later use if needed.
RUN touch /var/log/cron.log
# Execute the files.
RUN crontab /etc/crontabs/certbot-renew-crontab >> /var/log/cron.log 2>&1