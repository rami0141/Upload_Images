'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require("multer");


// Set Storage Engine
const storage = multer.diskStorage({
    //Where to store images
    destination: './public/upload/',
    filename: function (req, file, cb) {
        // filedname is the name in the html - date.now will add a time stamp - extname is JPG, PNG, etc
        cb(null, file.fieldname + '-' +  path.extname(file.originalname));
    }
});

//Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 3000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage'); //upload multiple files by using arrays() instead of single() = single files

// Check File Type
function checkFileType(file, cb) {
    //Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //Check Mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Init app
var app = express();

// public folder
app.use(express.static('./public'))


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post('/upload', (req, res) => {
    /*res.send('test');*/ //this sends text to the browser
    upload(req, res, (err) => {
        if (err) {
            res.send('error');
            console.log('error');
        } else {
            res.sendFile(path.join(__dirname, "index.html"));
        }
    });
});

//app.get('/comingsoon.JPG', function (req, res) {
//    res.sendfile(path.resolve('upload/comingsoon.JPG'));
//});

const port = 3000;
app.listen(port, () => console.log('Server started on port ${port}'));














