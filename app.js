const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Email = require('./models/emails');
const Data = require('./models/data');
var bcrypt = require('bcrypt');
var salt = 10;
const { request } = require('express');
const { isMatch } = require('lodash');
const jwt = require("jsonwebtoken");
const auth = require('./models/auth');
const flash = require('connect-flash');
const session = require('express-session');

// express app
const app = express();

// connect to mongodb
const dbURI = 'mongodb+srv://gokakyuu:1234@nodecourse.clpgx.mongodb.net/Node_DB?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser : true, useUnifiedTopology: true})
.then((result) => app.listen(1337))
.catch((err) => console.log(err));


// register view engine
app.set('view engine', 'ejs');
app.set('views', 'MedCareers');
app.use(express.urlencoded({ extended: true }));

//Express session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//conect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
    res.locals.succes_msg = req.flash('succes_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// middleware & static files
app.use(express.static('MedCareers'));
app.use(morgan('dev'));


app.get('/', (req, res) => {
    res.render('index', {title: 'Med', data: null})
});

app.post('/index', (req, res) => {
    const email = new Email(req.body);
    email.save()
        .then((result) => {
            res.redirect('/#read');
        })
        .catch((err) =>  {});
});

app.get('/index', (req, res) => {
    res.render('index', { title: 'Med' });
});

app.get('/subscribers', (req, res) =>{
    Email.find().sort({ createdAt : -1})
        .then((result) => {
            res.render('partials/subscribers', {title: 'Med', emails: result})
        })
        .catch((err) => {
            console.log(err);
        });
});

// sign up
app.get('/signup', (req, res) =>{
    res.render('partials/signup'); 
});

app.post('/signup', async(req, res) => {
    const {firstName, lastName, emailAddress, gender, city, country, password} = req.body;
    let errors = [];
    if (!emailAddress || !firstName || !lastName || !gender || !city || !country || !password)
        errors.push({msg: 'please fill in all fields'});
    if (password.length < 6)
        errors.push({msg: 'password should be at least 6 characters'});
    if (errors.length > 0)
        res.render('partials/signup', {errors, firstName, lastName, emailAddress, gender, city, country, password})
    else{
        Data.findOne({emailAddress : emailAddress})
            .then(async(data) => {
                if (data) {
                    errors.push({msg: 'Email is already registered'});
                    res.render('partials/signup', {errors, firstName, lastName, emailAddress, gender, city, country, password});     
                }
                else{
                    req.body.password  = await bcrypt.hash(password, salt)
                    const data = new Data(req.body);
                    data.save()
                        .then((result) => {
                            req.flash('succes_msg', 'you are now registered and can log in');
                            res.redirect('login');
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
            })
        }
})

// login
app.get('/login', (req,res) => {
    res.render('partials/login', {title: 'Med'});
});

app.post('/login', async (req, res) => {
    Data.findOne({emailAddress: req.body.email})
        .then((result) => {
            bcrypt.compare(req.body.password, result.password, (err, isMatch) => {
                if (err)
                    console.log(err);
                else if (isMatch)
                {
                    console.log('lol');
                    // jwt.sign({user: result}, result.emailAddress, (err, token) => {
                    //     if (err)
                    //         console.log(err);
                    //     result.token = token;
                        res.render('index', {title:'Med', data:result})       
                }
                else
                {
                    req.flash('error_msg', 'Wrong password');
                    res.redirect('login');
                }
            })
        })
        .catch((err) => {
            console.log(err);
    });
});

// auth

// app.post('/login', auth, (req,res) => {
//     jwt.auth(req.token, req.body.emailAddress, (err, authData) => {
//         if (err)
//             console.log(err);
//         else{
//             res.render('index', {title:'Med', data:authData});
//         }
//     })
// })

// redirects
app.get('index-me', (req,res) => {
    res.redirect('index');
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404');
});