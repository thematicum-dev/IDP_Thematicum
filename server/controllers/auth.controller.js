import {AppError, AppAuthError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import User from '../models/user';
import * as authUtilities from '../utilities/authUtilities';
import DataRepository from '../data_access/dataRepository';
var request = require('request');

const repo = new DataRepository();

export function signup(req, res, next) {
    // repo.isAccessCodeValid(req.body.accessCode, req.body.currentTime)
    //     .then(results => {
    //         if(!results) {
    //             return next(new AppError('Invalid Access Code', 500));
    //         }

            //check for password length
            if (req.body.user.password.length < 8) {
                return next(new AppError('Validation error: password must be no shorter than 8 characters', 500));
            }

            const user = new User({
                name: req.body.user.name,
                email: req.body.user.email,
                password: req.body.user.password,
                personalRole: req.body.user.personalRole
            });

            repo.save(user).then(() => {
                return res.status(201).json(new AppResponse('User created', null))
            }).catch(err => next(err));
        //});
}

export function signin(req, res, next) {
    repo.getUserByEmail(req.body.email)
        .then(user => {
            if(!user) {
                return next(new AppError('Invalid login credentials', 401));
            }

            //check password
            if (!user.passwordIsValid(req.body.password)) {
                return next(new AppError('Invalid login credentials', 401));
            }

            const token = authUtilities.jwtSign({user: user});
            res.status(200).json({
                message: 'Successful login',
                token: token,
                username: user.name
            });
        })
        .catch(err => next(err));
}

export function isAuthenticated(req, res, next) {
    authUtilities.jwtVerify(req.headers['authorization'])
        .then(decoded => {
            return res.status(200).json(new AppResponse('User is authenticated', null));
        })
        .catch(err => {
            return next(new AppAuthError(err.name, 401));
        });
}

export function test(req, res, next) {
	return res.status(200).json({'sucess':1});
}


export function captcha(req, res, next) {

	console.log("Request");
	console.log(req.body);
	// Set the headers
	var headers = {
		'User-Agent':       'Super Agent/0.0.1',
		'Content-Type':     'application/json'
	}

	var options = {
    		url: 'https://www.google.com/recaptcha/api/siteverify',
   		method: 'POST',
    		headers: headers,
    		form: req.body
	};

	// Start the request
	request(options, function (error, response, body) {
    		if (!error && response.statusCode == 200) {
       		 // Print out the response body
        			return res.status(200).json(body);
   		 }
		else{
			return res.status(400).json(body);
		}
	})

	
}