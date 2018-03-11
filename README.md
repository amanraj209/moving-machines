# Moving Machines

A realtime synchronized Node.js app using LokiJS and Nunjucks.

LokiJS is lightweight Javascript in-memory database with a very simple API to use.

Nunjucks is a rich and powerful templating engine for JavaScript developed by Mozilla with Jinja2 like syntax and also supports template inheritance.

## Using

- [Express](https://expressjs.com/)
- [LokiJS](http://lokijs.org/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)

## Folder Structure
```
moving-machines/
    bin/
        www
    public/
        javascripts/
        stylesheets/
    routes/
        index.js
        health.js
    views/
        base.html
        error.html
        health.html
        index.html
    .gitignore
    app.js
    package.json
    package-lock.json
    README.md
```

## Installation
```
$ git clone https://github.com/amanraj209/moving-machines.git
$ cd moving-machines
$ npm install
$ npm start
```

Server will run on http://localhost:3000.
