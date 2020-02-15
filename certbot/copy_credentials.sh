#!/bin/sh

# Make sure our external bind exists.
mkdir -r /ssl_creds
# Use wildcards to find and copy the fullchain and privkey to the externally bound folder.
cp -R /etc/letsencrypt/live/*/*fullchain.pem /etc/letsencrypt/live/*/*privkey.pem /ssl_creds