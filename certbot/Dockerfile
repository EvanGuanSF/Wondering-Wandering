# Just get the default build from certbot.
# Commands will be given it to it from the compose file on container startup.
FROM certbot/certbot

WORKDIR /

# Make a new cron job that runs every few days that renews the certbot ssl credentials.
# Install cron on the system.
RUN apt-get update && apt-get -y install cron
# Copy our pre-made crontab file.
COPY certbot-renew-crontab /etc/cron.d/certbot-renew-crontab
# Change the permissions of the file so that it can be executed.
RUN chmod 0644 /etc/cron.d/certbot-renew-crontab
# Create a log for later use if needed.
RUN touch /var/log/cron.log
# Execute the files.
RUN crontab /etc/cron.d/certbot-renew-crontab >> /var/log/cron.log 2>&1