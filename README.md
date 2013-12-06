comp6017
========

Node.js Coursework

Something odd is going on with the database and the ORM, haven't yet worked out what. When lines 5-15 in app.js are commented out URLs load fine, otherwise the browser just sits there spinning indefinitely. Progress is as follows:

Package.json built and apparently working
Models written and loading into the DB correctly, using sqlite for now for simplicity's sake

To get started:
npm install (if you encounter errors compiling bcrypt, just remove that from the package.json for now)
node sync.js (sets database up)
npm start (starts the node server running the app.js script)