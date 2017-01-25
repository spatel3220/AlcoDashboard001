var bodyParser = require('body-parser');
var csrf = require('csurf');
var express = require('express');
var mongoose = require('mongoose');
var session = require('client-sessions');

var middleware = require('./middleware');

/**
 * Given a user object:
 *
 *  - Store the user object as a req.user
 *  - Make the user object available to templates as #{user}
 *  - Set a session cookie with the user object
 *
 *  @param {Object} req - The http request object.
 *  @param {Object} res - The http response object.
 *  @param {Object} user - A user object.
 */
module.exports.createUserSession = function(req, res, user) {
  var cleanUser = {
    firstName:  user.firstName,
    lastName:   user.lastName,
    email:      user.email,
    devices:    user.devices || {}
  };

  req.session.user = cleanUser;
  req.user = cleanUser;
  res.locals.user = cleanUser;
};

/**
 * Ensure a user is logged in before allowing them to continue their request.
 *
 * If a user isn't logged in, they'll be redirected back to the login page.
 */
module.exports.requireLogin = function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};
