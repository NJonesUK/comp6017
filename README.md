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




Things we need to do:

-user -> Richard
-questions -> Richard
-answers -> Richard
-comments -> Tom


-voting on questions & answers -> Nick
-expose search for questions -> Tom
-get user’s questions -> Richard

-when returning a question, it should return the question, the answers associated without the question, and the comments associated with both questions & answers. Will have to wait for Richard to get user's questions first -> Tom


-initial db setup -> Nick
-hashing of password -> Nick
-authentication -> Nick
-curl script for demonstration (we need to cover every route in our application) -> Nick

-unit testing -> All unit test appropriate stuff.
-documentation (20% total for documentation) -> All.



To get started:

npm install (if you encounter errors compiling bcrypt, just remove that from the package.json for now)
node sync.js (sets database up)
npm start (starts the node server running the app.js script)

JSLint setup can be found here: http://infoheap.com/jslint-command-line-on-ubuntu-linux/

There are example ajax requests if you want to use those for testing. In addition, you can navigate to the pages them selves (e.g. http://localhost:8888/users) and see the output directly.


WARNING:

I currently can't get the models to load in from models.js, so i've declared them in app.js.

The index GET request is no returning JSON, not how to fix yet.