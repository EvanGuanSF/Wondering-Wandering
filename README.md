# Wondering Wandering
Portfolio webpage based on SFSU Software Engineering course work.
<br></br>
### **!!! Readme not yet updated for React implementation !!!**
<br></br>
Meant to run in Docker containers on a cloud provider (AWS EC2 for example). There are four containers running:
 - Node.js with Express as the core of the webapp with endpoint handling and fileserver functions.
 - Nginx running as a reverse proxy for serving https certificates and guaranteeing https-only connections to the container network.
 - Certbot for acquiring and renewing Certificate Authority signed certificates for Nginx to serve.
 - Redis for the in-memory datastore used by Express Rate Limiter in the Node.js container.
 
 A seperate non-containerized MySQL Server provides the persistent backend database for the webapp.

Client-side experience via Javascript+jQuery, with much of the cookie-cutter components and interactivity provided by Bootstrap. Basic user login and persistent session via json web tokens in cookies is present and ready to use.
<br></br>
# Usage Instructions:
This repository contains most of the essentials needed to launch a site with the same layout, including MySQL creation schema, authentication file templates, and required npm packages list.

#### In general, the setup procedure should be along these lines:
1. Acquire a physical or cloud machine to run the server on and get this repository onto it (git clone url).
2. Get your data storage in order. Install and run initial configuration for a MySQL server, then run the included database creation schema in the /app/model folder. May require creating the general_db. Download and install Redis for your operating system as well. Extra optional instructions/commands for creating a MySQL user can be found in "/app/Setup information.txt".
3. Get and install Docker and docker-compose via installer or command line package manager. Get, install, and configure according to:
     - Windows/MacOS: https://docs.docker.com/get-started/
     - Linux (Pick whichever distro you have in the left menu): https://docs.docker.com/install/linux/docker-ce/ubuntu/
4. __IMPORTANT: Copy and rename '.env_template' to '.env' in the root folder of the repository. Be sure to change the default provided values to values that are relevant to your needs. Do the same for the .env_template in the app folder.__
5. On a linux machine, install ```openssl``` then run ```openssl dhparam -out dhparam.pem 4096 .``` to generate strong Diffie-Hellman parameters. Move the file to /nginx/conf
6. Acquire a ssl certificate via https://certbot.eff.org/ or other organization. Self-signed openssl certificates are adequate for dev testing environments.
     - For openssl self-signed credentials: On a linux machine, install ```openssl``` then run ```sudo openssl req -x509 -nodes -days 30 -newkey rsa:2048 -keyout ./privkey.pem -out ./fullchain.pem```
     - Rename the certificate file to fullchain.pem and key file to privkey.pem if you generated them in another way.
     - __Place the renamed files in /nginx__
7. Modify the AboutMe.txt file in /views/public to fit your needs.
8. Add a picture with the name 'me.png' to app/views/public/img Add and populate /app/views/public/files with a resume.pdf so the resume link works (or modify navbar.html and remove it).
9. Add your own projects to the MySQL database. Variable names should be relatively straightforward, and match with client-side naming.
10. Now the containers just need to be built and started. On the command line in same folder as app.js, enter:
     - docker-compose up --build -d
11. To take the containers down, enter:
     - docker-compose down

Barring router port forwarding issue or some other misconfiguration, the website should be up and running.
<br></br>
# Maintenance
To check the status of the containers, you can enter:
 - ```docker ps -a``` to see the id, status, and uptime of the containers.

To get a shell terminal for the container.
 - ```docker exec -it <CONTAINER ID from above; 3 chars is usually enough> /bin/sh``` 

To apply changes in the project directory to the live app:
 - Simply make changes to the files in the /app directory. Nodemon should reload the app automatically as changes are detected.
