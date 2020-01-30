# Wondering Wandering
Portfolio webpage based on SFSU Software Engineering course work.

Meant to run in Docker containers on a cloud provider (AWS EC2 for example). The two primary containers are a node.js application using Express for routing and a Redis container for the in-memory datastorage used by Express Rate Limiter in the former container. A seperate non-containerized MySQL Server provides the persistent backend database for the webapp.

Client-side experience via Javascript+jQuery, with much of the cookie-cutter components and interactivity provided by Bootstrap.
<br></br>
## Usage Instructions:
This repository contains most of the essentials needed to launch a site with the same layout, including MySQL creation schema, authentication file templates, and required npm packages list.

#### In general, the setup procedure should be along these lines:
1. Acquire a physical or cloud machine to run the server on and get this repository onto it.
2. Install and run initial configuration for a MySQL server, then run the included database creation schema in the model folder. May require creating the general_db. Download and install Redis for your operating system as well. __This may well be by far the most difficult step, but there are many guides online on how to setup a MySQL server.__ Extra instructions/commands for setting up port forwarding on a Linux system and creating a MySQL user can be found in "/Setup information.txt".
3. Get and install Docker and docker-compose via installer or command line package manager. Get, install, and configure according to:
     - Windows/MacOS: https://docs.docker.com/get-started/
     - Linux (Pick whichever distro you have in the left menu): https://docs.docker.com/install/linux/docker-ce/ubuntu/
5. __IMPORTANT: Remove the word "Backup" from the filenames in the auth folder, then update the files in the folder with correct server configuration information.__
6. Modify the AboutMe.txt file in views/public to fit your needs.
7. Add a picture with the name 'me.png' to /views/public/img Add and populate /views/public/files with a resume.pdf so the resume link works (or modify navbar.html and remove it).
8. Add your own projects to the MySQL database. Variable names should be relatively straightforward, and match with client-side naming.
9. Now the containers just need to be built and started. On the command line in same folder as app.js, enter:
     - docker-compose build
     - docker-compose up -d
10. To take the containers down, enter:
     - docker-compose down

Barring router port forwarding issue or some other misconfiguration, the website should be up and running.

To apply changes in the project directory to the live app, execute step 10 and then step 9.

To check the status of the containers, you can enter:
  - "docker ps -a" to see the id, status, and resource usage of the containers.
  - "docker exec -it <CONTAINER ID from above; 3 unique chars is enough> /bin/bash" to get a bash terminal for the container.
