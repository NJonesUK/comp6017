comp6017
========

Node.js Coursework

Progress is as follows:

Package.json built and apparently working
Models written and loading into the DB correctly
Using sqlite due to spec
User requests URLs have been made avaliable, test using AJAX and they all work. 
Verification has been performed on the User class using express validator. It's pretty simple & self explanitory.
File has been JS Linted. Please keep it that way, I recommend continually running js lint as you develop.


Testing has not been done yet.

To get started:
npm install (if you encounter errors compiling bcrypt, just remove that from the package.json for now)
node sync.js (sets database up)
npm start (starts the node server running the app.js script)

JSLint setup can be found here: http://infoheap.com/jslint-command-line-on-ubuntu-linux/