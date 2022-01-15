require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const findOrCreate = require("mongoose-findorcreate");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    githubId: String,
    twitterId: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("user",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    //   console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/secrets"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile);
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CLIENT_ID,
    consumerSecret: process.env.TWITTER_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/twitter/Raghav0403"
  },
  function(token, tokenSecret, profile, cb) {
    // console.log(profile);
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/",function(req,res){
    res.render("home");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] }));

  app.get('/auth/github',
  passport.authenticate('github', { scope: [ "user:email" ] }));

  app.get('/auth/twitter',
  passport.authenticate('twitter'));


  app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });

  app.get("/auth/github/secrets", 
  passport.authenticate("github", { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/secrets');
  });

  app.get('/auth/twitter/Raghav0403', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/logout",function(req,res){
    req.logout();
  res.redirect('/');
})

app.get("/secrets",function(req,res){
    
    User.find({"secret" : {$ne: null}},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                res.render("secrets",{userWithSecrets: foundUser});
            }
        }
    });

});

app.get("/submit",function(req,res){
    if(req.isAuthenticated()){
        res.render("submit");
    }else{
        res.redirect("/login");
    }
});

app.post("/submit",function(req,res){
    const submittedSecret = req.body.secret;
    
    // console.log(req.user._id);

    User.findById(req.user._id,function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                foundUser.secret = submittedSecret;
                foundUser.save(function(){
                    res.redirect("/secrets");
                });
            }
        }
    });

});

app.post("/register",function(req,res){
    User.register({username: req.body.username},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })

});

app.post("/login",function(req,res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    });

});




app.listen(3000,function(){
    console.log("server started on port 3000");
})