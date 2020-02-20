FROM nginx

WORKDIR /tmp

# Make a new cron job that runs every few hours that reloads nginx.
# Install cron on the system.
RUN apt-get update && apt-get -y install cron
# Copy our pre-made crontab file.
COPY nginx-reload-crontab /etc/cron.d/nginx-reload-crontab
# Change the permissions of the file so that it can be executed.
# Create a log for later use if needed.
# Execute the files.
RUN /bin/bash -c 'chmod 0644 /etc/cron.d/nginx-reload-crontab \
    && touch /var/log/cron.log \
    && crontab /etc/cron.d/nginx-reload-crontab >> /var/log/cron.log 2>&1'

# Remove the nginx .conf files if they exist, then make empty placeholders for the envsubst.
RUN /bin/bash -c 'rm -f /etc/nginx/conf.d/nginx.conf /etc/nginx/conf.d/snippets/ssl-params.conf \
    && mkdir -p /etc/nginx/conf.d/ /etc/nginx/conf.d/snippets/ \
    && touch /etc/nginx/conf.d/nginx.conf /etc/nginx/conf.d/snippets/ssl-params.conf'