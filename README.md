comp6017
========

Node.js Coursework

FAO NICK:

I have just checked through the code while on board this flight. I have made a series of fixes on Richard's code and probably have a horrific merge to deal with as a result :)

Basically, Richard didn't bind answers to questions. I've now done that. It is likely to be buggy and as such I had to rush through some bits of the code and basically didn't manage to get it fully running. I have therefore done:
* Answers binding to questions
* Updated test cases for these
* Test cases for comments in full (but may not work, please fix or text me or something.)
* I've done a function that does the overall querying, but this may not work properly. It should just need a couple of lines here and there.

URL schema is as follows:
* /questions 
* /questions/comments/:question_id/:answer_id - except when deleting a comment. You may want to change this.
* /answers
* /answers/comments/:question_id/:answer_id

** WE HAVE NOT USED HEAD ANYWHERE, CAN WE FIND A USE **

I hope that is OK?


Progress is as follows:

Package.json built and apparently working
Models written and loading into the DB correctly
Using sqlite due to spec
User requests URLs have been made avaliable, test using AJAX and they all work. 
Verification has been performed on the User class using express validator. It's pretty simple & self explanitory.
File has been JS Linted. Please keep it that way, I recommend continually running js lint as you develop.




Things we need to do:

-user -> Richard √
-questions -> Richard √
-answers -> Richard √
-comments -> Tom


-voting on questions & answers -> Nick
-expose search for questions -> Tom
-get user’s questions -> Richard √

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