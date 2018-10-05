import {AppError, AppAuthError, AuthError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import User from '../models/user';
import * as authUtilities from '../utilities/authUtilities';
import DataRepository from '../data_access/dataRepository';
import request from 'request';
import async from 'async';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const repo = new DataRepository();

export function signup(req, res, next) {
	check_captcha(req.body.response).then(body => {
		if (!body.success) {
			return next(new AppError('Captcha Invalid', 401));
		} else {
			repo.isAccessCodeValid(req.body.user.accessCode, req.body.user.currentTime)
				.then(results => {
					if (!results) {
						return res.status(401).json(new AuthError('Invalid authentication code.','signup'));
					}
					else if (req.body.user.user.password.length < 8) {
						return res.status(500).json(new AuthError('Validation error: password must be no shorter than 8 characters','signup'));
					} else {

						const user = new User({
							name: req.body.user.user.name,
							email: req.body.user.user.email,
							password: req.body.user.user.password,
							personalRole: req.body.user.user.personalRole
						});


						if(req.body.user.subscription) {
							repo.addEmailToSubscription(req.body.user.user.email);
						}
						

						repo.save(user).then(() => {
							return res.status(201).json(new AppResponse('User created', null))
						}).catch(err => next(err));
					}

					
				});
		}
	});
}

export function signin(req, res, next) {

	check_captcha(req.body.response).then(body => {
		if (!body.success) {
			return next(new AppError('Captcha Invalid', 401));
		} else {
			repo.getUserByEmail(req.body.user.email)
				.then(user => {
					if (!user) {
						return res.status(401).json(new AuthError('Invalid login credentials. Please login with correct username or password.', 'signin'));
					}
					else if (!user.passwordIsValid(req.body.user.password)) {
						return res.status(401).json(new AuthError('Invalid login credentials. Please login with correct username or password.','signin'));

					} else {

						const token = authUtilities.jwtSign({ user: user });
						if (!user.isAdmin){
							user.isAdmin = false;
						}
						res.status(200).json({
							message: 'Successful login',
							token: token,
							username: user.name,
							email:user.email,
							isAdmin:user.isAdmin,
							datejoined: user.createdAt
						});
					}
					
				})
				.catch(err => next(err));
		}
	});
}

export function isAuthenticated(req, res, next) {
    authUtilities.jwtVerify(req.headers['authorization'])
        .then(decoded => {
            return res.status(200).json(new AppResponse('User is authenticated', null));
        })
        .catch(err => {
            return res.status(401).json(new AppResponse('User is authenticated', new AppAuthError(err.name, 401)));
        });
}




export function forgot(req,res,next) {
	console.log("Forgot server activated");
	async.waterfall([

		function(done) {
			crypto.randomBytes(20, function(err,buf) {
				var token = buf.toString('hex');
				done(err,token);
			});
		},

		function(token,done) {

			repo.getUserByEmail(req.body.user.email)
				.then(user=> {

					if(!user) {
						return res.status(401).json(new AuthError('The email id does not exist.', 'forgot'));
					}

					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000;

					user.save(function(err) {
						done(err,token,user);
					});

				}).catch(err => next(err));
		},

		function(token,user,done) {

			 var smtpTransport = nodemailer.createTransport({
		        service: 'Gmail',
		        auth: {
		          user: 'thematicum.dev@gmail.com',
		          pass: 'Vh9k238BhDZa6$Cb'
		        }
		      });
		      var mailOptions = {
		        to: user.email,
		        from: 'passwordreset@thematicum.com',
		        subject: 'Thematicum Password Reset',
		        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
		          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
		          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
		          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		      };
		      smtpTransport.sendMail(mailOptions, function(err) {
		        done(err, 'done');
		      });

		      return res.status(401).json(new AuthError('Email has been sent!','forgot'));
		}

	], function(err) {

		if(err) {
			return next(err);
		}


	});
}

export function reset(req,res,next) {
	
	async.waterfall([
	    function(done) {
	      repo.getUserByPasswordExpiry(req.body.token, { $gt: Date.now() })
				.then(user=> {
	        if (!user) {
	          return res.status(401).json(new AuthError('Password reset token is invalid or expired.', 'reset'));
	        }

	        user.password = req.body.user.password;
	        user.resetPasswordToken = undefined;
	        user.resetPasswordExpires = undefined;

	        user.save(function(err) {
	            done(err, user);
	          
	        });
	      });
	    },
	    function(user, done) {
	      console.log("Password has been reset!");
	      return res.status(401).json(new AuthError('Password has been changed!','reset'));
	    }
  ], function(err) {
    
    	if(err) {
			return next(err);
		}
  });


}

export function test(req, res, next) {
	return res.status(200).json({'sucess':1});
}

function check_captcha(response) {
	var headers = {
		'User-Agent': 'Super Agent/0.0.1',
		'Content-Type': 'application/json'
	}

	var options = {
		url: 'https://www.google.com/recaptcha/api/siteverify',
		method: 'POST',
		headers: headers,
		form: {
			'secret': '6Lei-x0UAAAAAEotaBi4offnjLf9xo9uePxFsUiJ',
			'response': response
		}
	};

	return new Promise((resolve, reject) => {
		request(options, function (error, response, body) {
			if (error) {
				reject(error)
			}
			resolve(JSON.parse(body));
		});
	});
}