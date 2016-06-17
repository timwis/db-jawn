# Dataface
Desktop application to manage Postgres databases (**Work in Progress**)

## Background
Have you ever wanted to open a database, create a table, add a few fields and some data?
So has just about every other developer! So why is there no free, open source, multi-platform
application with a modern-looking UI available? And if there were, it would probably be just
for one flavor of database.

Dataface aims to be just that, and hopefully for multiple flavors of database (at least Postgres
and MySQL, maybe more). It won't be as fully-featured as some of the other tools out there,
but it will provide the simple stuff simply.

## Technology
Dataface is a JavaScript application using the 
[:steam_locomotive::train::train::train::train::train:](https://github.com/yoshuawuyts/choo/)
[choo](https://github.com/yoshuawuyts/choo/)
framework. It's almost entirely client-side, but since it needs to access databases, it's
built as a cross-platform desktop application using [electron](http://electron.atom.io/).

## Development
* Clone the repository and install dependencies via `npm install`
* Run the electron app via `npm start`
