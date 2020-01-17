# Wondering Wandering
Portfolio webpage based on SFSU Software Engineering course work.
 
Meant to run on a cloud provider (AWS EC2) as a node.js application using Express for routing, Express Rate Limit with Redis for rate control, and MySQL for backend database.
 
Client-side experience via Javascript+jQuery, with much of the cookie-cutter components and interactivity provided by Bootstrap.
<br></br>
<br></br>
## To use:
This repository contains most of the essentials needed to launch a site with the same layout, including MySQL creation schema, authentication file templates, and required npm packages list.
<br></br>
#### In general, the setup procedure should be along these lines:
1. Acquire a physical or cloud machine to run the server on and get this repository on it.
2. Install and run initial configuration for a MySQL server, then run the included database creation schema in the model folder. May require creating the general_db. Download and install Redis for your operating system as well. __This may well be by far the most difficult step, but there are many guides online on how to setup a MySQL server. Redis setup is relatively easy.__
3. Get and install Node.js via download or package manager.
4. On a command line whose working directory is the same directory as app.js:
     - Windows: npm install
     - MacOS/Linux: sudo npm install
5. __IMPORTANT: Remove the word "Backup" from the filenames in the auth folder, then update the files in the folder with correct server configuration information.__
6. Modify the AboutMe.txt file in views/public to fit your needs.
7. Add a picture with the name 'me.png' to /views/public/img
8. Add your own projects to the MySQL database. Variable names should be relatively straightforward, and match with client-side naming.
9. You should be ready to go. On the command line in same folder as app.js, type 'nodemon', and barring firewall or some other misconfiguration, the website should be up and running.
