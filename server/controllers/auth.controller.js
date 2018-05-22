import {AppError, AppAuthError, AuthError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import User from '../models/user';
import * as authUtilities from '../utilities/authUtilities';
import DataRepository from '../data_access/dataRepository';
import request from 'request';

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