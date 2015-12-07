'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');
var lwip = require('lwip');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  if(!req.recaptcha) {
    return res.status(422).send('Creating user requires sending recaptcha response');
  }
  if(req.recaptcha.error) {
    console.log(req.recaptcha);
    return res.status(422).send('Could not verify captcha:\n' + req.recaptcha.error);
  }

  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';

  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

/**
 * Change a users profile fields
*/
exports.update = function(req, res, next) {
  var userId = req.user._id;
  var profile = req.body;
  var file = req.files.file;
  var photo = req.user.photo || '/static/mapn/profile.png';

  User.findOne({_id: userId }, function(err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');

    user.name = profile.name;
    user.email = profile.email;
    user.photo = photo;
    user.phone = profile.phone;
    user.save();

    // Process user profile image
    if (file && file.path) {
      var photoFile = '/' + uuid.v4() + '.png';
      var filePath = path.resolve('./server/static') + photoFile;
      lwip.open(file.path, function(err, image) {
        image.resize(100, 100, function(err, image) {
          image.toBuffer('png', function(err, buffer) {
            // save buffer to disk
            fs.writeFile(filePath, buffer, function(err) {
              if(err) {
                  return console.log(err);
              } else {
                photo = '/static' + photoFile;
                user.photo = photo;
                console.log('saving photo ' + photo);
                user.save();
              }
            });
            // delete temp file
            fs.unlink(file.path);
          });
        });
      });
    }


    res.status(200).send('OK');
  });

};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
