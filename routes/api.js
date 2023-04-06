
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Book = require("../models/book");

const bodyParser = require("body-parser");

// // parse requests of content-type - application/json
router.use(bodyParser.json());

const parser = bodyParser.urlencoded({ extended: true });

router.use(parser);
router.get('/', (req, res) => {
    res.render('dangky')
})
router.get('/signin',(req,res)=>{
    res.render('dangnhap')
})
router.post('/signup', async function (req, res) {

    if (!req.body.username || !req.body.password) {
        res.json({ success: false, msg: 'Please pass username and password.' });
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password
        });
        // save the user
        await newUser.save();
        
        // res.json({ success: true, msg: 'Successful created new user.' });
    }
});

 
router.post('/signin', async function (req, res) {
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
        res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
    } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
                // if user is found and password is right create a token
                var token = jwt.sign(user.toJSON(), config.secret);
                // return the information including token as JSON
                res.json({ success: true, token: 'JWT ' + token });
                // res.redirect('/api/book')
            } else {
                res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
            }
        });
    }
});


// router.post('/book', passport.authenticate('jwt', { session: false }), function (req, res) {
//     var token = getToken(req.headers);
//     if (token) {
//         console.log(req.body);
//         var newBook = new Book({
//             isbn: req.body.isbn,
//             title: req.body.title,
//             author: req.body.author,
//             publisher: req.body.publisher
//         });

//         newBook.save(function (err) {
//             if (err) {
//                 return res.json({ success: false, msg: 'Save book failed.' });
//             }
//             res.json({ success: true, msg: 'Successful created new book.' });
//         });
//     } else {
//         return res.status(403).send({ success: false, msg: 'Unauthorized.' });
//     }
// });


router.get('/book', passport.authenticate('jwt', { session: false }), async function (req, res) {
    var token = getToken(req.headers);
    console.log(" co: "+token);
    if (token) {
        let books = await Book.find();

        res.json(books);
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});

getToken = function (headers) {
    console.log(headers);
    console.log(headers.authorization);
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;
