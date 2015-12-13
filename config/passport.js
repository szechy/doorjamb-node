// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up Person
var Person = require('../app/models/person');

// expose this function to our app using module.exports
module.exports = function(passport) {
  // passport session setup
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize persons out of session
  passport.serializeUser(function(person, done) {
    done(null, person.id);
  });

  passport.deserializeUser(function(id, done) {
    Person.findById(id, function(err, person) {
      done(err, person);
    });
  });

  // LOCAL SIGNUP
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses personname and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request
  },
  function(req, email, password, done) {
    console.log('test ' + email);
    // asynchronous
    // Person.findOne wont fire unless data is sent back
    process.nextTick(function() {
      console.log('finding ');// + password);
      // find a person whose email is same as forms' email
      // we are checking to see if person trying to login already exists
      var newPerson = new Person();

      newPerson.local.email = email;
      newPerson.local.password = newPerson.generateHash(password);
      console.log(newPerson.local.password);

      newPerson.save(function(err) {
        console.log("saved!");
        if(err)
          throw err;
        return done(null, newPerson);
      });
      /*Person.findOne({'local.email': email}, function(err, person) {
        console.log('finding one for realz');
        // if there are any errors, return that error
        if(err)
          return done(err);

        // check to see if there's already a suer with that email
        if(person) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          // if there is no person with that meail
          // create the person
          var newPerson = new Person();

          // set local credentials
          newPerson.local.email = email;
          newPerson.local.password = newPerson.generateHash(password);

          // save the person
          newPerson.save(function(err) {
            if(err)
              throw err;
            return done(null, newPerson);
          });
        }
      });*/
    });
  }));

  // LOCAL LOGIN
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses personname and passowrd, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // alows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {
    // find person with email same as forms email
    // checking to see if person trying to login already exists
    Person.findOne({'local.email': email}, function(err, person) {
      // reutrn error if exists
      if(err)
        return done(err);

      // if no person found, return message
      if(!person)
        return done(null, false, req.flash('loginMessage', 'No person found.')); // req.flash is way to set flashdata using connect-flash
      if(!person.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create loginMessage, save to session as flashdata

      // all is well, lreturn successful person
      return done(null, person);
    });
  }));
};
