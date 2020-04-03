# Wondering Wandering
Portfolio webpage, originally based on SFSU Software Engineering course work.

Meant to run in Docker containers on a cloud provider (AWS EC2 for example). There are several containers running:
 - A Nginx container which acts as a reverse proxy for the container network, enables HTTPS via Certbot SSL certificates, and is the static file server, serving the production build React web app and static files.
 - A Node.js + Express container that is the backend api endpoint server for requesting data from the website's offsite MySQL database.
 - A Certbot container for acquiring and renewing Certificate Authority signed certificates for Nginx to serve.
 - Redis for the in-memory datastore used by Express Rate Limiter in the Node.js container.
 
A seperate non-containerized MySQL Server provides the persistent backend database for the webapp.

Client-side experience via React.js with much of the cookie-cutter components and interactivity provided by Bootstrap. Basic user login and persistent sessions via json web tokens in cookies is present and ready to use.
<br></br>
# Usage Instructions:
This repository contains most of the essentials needed to launch a site with the same layout, including MySQL creation schema, authentication file templates, and required npm packages list.

#### In general, the setup procedure should be along these lines:
1. Acquire a physical or cloud machine to run the server on and get this repository onto it (git clone url).
2. Install and run initial configuration for a MySQL server, then run the included database creation schema in the /app/model folder. May require creating the general_db. Useful instructions/commands for creating a MySQL user can be found in "/app/Setup information.txt".
3. Get and install Docker and docker-compose via installer or command line package manager. Get, install, and configure according to:
     - Windows/MacOS: https://docs.docker.com/get-started/
     - Linux (Pick whichever distro you have in the left menu): https://docs.docker.com/install/linux/docker-ce/ubuntu/
4. __IMPORTANT: Make copies of '.env_template' in the below listed folder, rename them to '.env', and then adjust the '.env' files to your particular needs:__
     - The root directory /.env_template
     - The server folder /.server/.env_template
     - The app folder /.app/.env_template
5. On a linux machine, install ```openssl``` then run ```openssl dhparam -out dhparam.pem 4096 .``` to generate strong Diffie-Hellman parameters. Move the dhparam.pem file to ```/nginx/conf/```
6. Acquire a ssl certificate via https://certbot.eff.org/ or other organization. Self-signed openssl certificates are adequate for dev testing environments, but will not work for production deployments.
     - For openssl self-signed credentials: On a linux machine, install ```openssl``` then run ```sudo openssl req -x509 -nodes -days 30 -newkey rsa:2048 -keyout ./privkey.pem -out ./fullchain.pem```
     - Rename the certificate file to fullchain.pem and key file to privkey.pem if you generated them in another way.
     - __Place the renamed files in ```/ssl_creds/```__
7. Modify the AboutMe.txt file in ```/app/public/``` to fit your needs.
8. Add your own resume.pdf so the resume link works or comment out the resume link component in the navbar component and remove it.
9. Add your own projects to the MySQL database. Variable names should be relatively straightforward, and match with client-side naming.
10. The web app should now be ready.
 - For development testing using only the React app and the api server, run ```npm start``` in a terminal while in each:
     - ```/app/```
     - ```/server/```
 - For production, a script has been written to make it simple. Run ```./composeup.sh``` in the root directory.
11. To stop:
 - For development, just stop the programs in the terminals via ```ctrl + c``` or the equivalent for your terminal.
 - For production, a script has been written to make it simple. Run ```./stopcontainers.sh``` in the root directory.

Barring router port forwarding issue or some other misconfiguration, the website should be up and running.
<br></br>
# Maintenance
To check the status of the containers, you can enter:
 - ```docker ps -a``` to see the id, status, and uptime of the containers.

To get a shell terminal for the container:
 - ```docker exec -it <container name; usually a few characters + tab will autofill the name> /bin/sh``` 

To apply changes in the project directory to the live app:
 - In development, changes are reloaded in real time on a web browser.
 - In production, the current implementation requires that you take down the Nginx container at the very least. This is what I have found works; From the project root directory:
     - ```./stopcontainers.sh```
     - ```./cleanupdocker.sh```
     - Make changes to the web app or other parts.
     - ```./composeup.sh```