const http = require('http');

const fs = require('fs');

const port = 3000;

const host = "localhost";

const server = http.createServer((request, response) => {

    if (request.method === 'GET' && request.url == '/index') {

        fs.readFile('C:/Users/User/webgl-javascript/computer_graphics/index.html', null, (err, data) => {
            if (err) {
                throw (err);
            }
            if (data) {
                response.setHeader('Content-Type', 'text/html');
                response.write(data);
                response.end();
            }

        });
    }

    else if (request.method === 'GET' && request.url === '/webgl_assignment') {

        fs.readFile('C:/Users/User/webgl-javascript/webgl_assignment.css', null, (err, data) => {
            if (err) {
                throw (err);
            }
            if (data) {
                response.setHeader('Content-Type', 'text/css');
                response.write(data);
                response.end();
            }

        });
    }

    else if (request.method === 'GET' && request.url === '/gl-matrix') {

        fs.readFile('C:/Users/User/webgl-javascript/computer_graphics/gl-matrix.js', null, (err, data) => {
            if (err) {
                throw (err);
            }
            if (data) {
                response.setHeader('Content-Type', 'text/javascript');
                response.write(data);
                response.end();
            }

        });
    }

    else if (request.method === 'GET' && request.url === '/draw_diagram') {

        fs.readFile('C:/Users/User/webgl-javascript/computer_graphics/draw_diagram.js', null, (err, data) => {
            if (err) {
                throw (err);
            }
            if (data) {
                response.setHeader('Content-Type', 'text/javascript');
                response.write(data);
                response.end();
            }

        });
    }


    else if (request.method === 'GET' && request.url === '/manage_page') {

        fs.readFile('C:/Users/User/webgl-javascript/computer_graphics/manage_page.js', null, (err, data) => {
            if (err) {
                throw (err);
            }
            if (data) {
                response.setHeader('Content-Type', 'text/javascript');
                response.write(data);
                response.end();
            }

        });
    }

    else if (request.method === 'GET' && request.url === '/draw_shape') {

        fs.readFile('C:/Users/User/webgl-javascript/computer_graphics/draw_shape.js', null, (err, data) => {
            if (err) {
                throw (err);
            }
            if (data) {
                response.setHeader('Content-Type', 'text/javascript');
                response.write(data);
                response.end();
            }

        });
    }

    else if (request.method === 'GET' && request.url === '/draw_line') {

        fs.readFile('C:/Users/User/webgl-javascript/computer_graphics/draw_line.js', null, (err, data) => {
            if (err) {
                throw (err);
            }
            if (data) {
                response.setHeader('Content-Type', 'text/javascript');
                response.write(data);
                response.end();
            }

        });
    }

    else if (request.method === 'GET' && request.url === '/draw_triangle') {

        fs.readFile('C:/Users/User/webgl-javascript/computer_graphics/draw_triangle.js', null, (err, data) => {
            if (err) {
                throw (err);
            }
            if (data) {
                response.setHeader('Content-Type', 'text/javascript');
                response.write(data);
                response.end();
            }

        });
    }

    else if (request.method === 'GET' && request.url === '/draw_circle') {

        fs.readFile('C:/Users/User/webgl-javascript/computer_graphics/draw_circle.js', null, (err, data) => {
            if (err) {
                throw (err);
            }
            if (data) {
                response.setHeader('Content-Type', 'text/javascript');
                response.write(data);
                response.end();
            }

        });
    }
    else {
        response.statusCode = 404;
        response.end();
    }


}).listen(port, host);