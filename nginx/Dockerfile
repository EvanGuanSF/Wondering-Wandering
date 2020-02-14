FROM nginx

WORKDIR /tmp

# Make a new cron job that runs every few hours that reloads nginx.
# Install cron on the system.
RUN apt-get update && apt-get -y install cron
# Copy our pre-made crontab file.
COPY nginx-reload-crontab /etc/cron.d/nginx-reload-crontab
# Change the permissions of the file so that it can be executed.
RUN chmod 0644 /etc/cron.d/nginx-reload-crontab
# Create a log for later use if needed.
RUN touch /var/log/cron.log
# Execute the files.
RUN crontab /etc/cron.d/nginx-reload-crontab >> /var/log/cron.log 2>&1

# Copy our premade credentials from the host to the root of the container.
COPY fullchain.pem .
COPY privkey.pem .

# Remove the nginx .conf files if they exist, then make empty placeholders
# for the envsubst step in the docker-compose command.
RUN rm -f /etc/nginx/conf.d/nginx.conf /etc/nginx/conf.d/snippets/ssl-params.conf
RUN mkdir -p /etc/nginx/conf.d/ /etc/nginx/conf.d/snippets/
RUN touch /etc/nginx/conf.d/nginx.conf /etc/nginx/conf.d/snippets/ssl-params.conf