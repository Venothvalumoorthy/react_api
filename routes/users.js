var express = require('express');
var router = express.Router();
var MongoDB = require('./../routes/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");

// create user
router.post('/insert', async (req,res)=>{
    let errors = [];
	let body = req.body;

	if (typeof body === 'string') {
		try {
			body = JSON.parse(body);
		}
		catch (err) {
			errors.push('Unable to parse request body. ' + err.message);
		}
	}

    let firstname, lastname, email, password, role, mobile, status =1;
    if(errors.length === 0){
        let keys = Object.keys(body);
		if (keys.includes('firstname')) {
			firstname = body.firstname.trim();
		}else {
			errors.push('First name should be provided in the request body.');
		}

        if (keys.includes('lastname')) {
			lastname = body.lastname.trim();
		}else {
			errors.push('Last name should be provided in the request body.');
		}

        if (keys.includes('email')) {
			email = body.email.trim().toLowerCase();
		}
		else {
			errors.push('Email should be provided in the request body.');
		}

		if (keys.includes('password')) {
			plain_password = body.password.trim();
            password = bcrypt.hashSync(plain_password, saltRounds);
        //    let compare = bcrypt.compareSync(password, hash);
        //    console.log(compare)
		}
		else {
			errors.push('Password should be provided in the request body.');
		}

		if (keys.includes('role')) {
			role = body.role.trim();
		}else {
            errors.push('Role should be provided in the request body.');
		}

        
		if (keys.includes('mobile')) {
			mobile = body.mobile.trim();
            if (isNaN(mobile) || mobile.length !== 10) {
               errors.push("Invalid mobile number.")
            }
		}else {
            errors.push('Mobile number should be provided in the request body.');
		}
    }


    if(errors.length === 0){
        let document = {firstname, lastname, email, password, role, mobile, status};
        try {
			    await MongoDB.createUser(document);
		}
		catch (err) {
			errors.push(`Unable to create user. ${err.message}`);
		}
    }

    if (errors.length === 0) {
		res.send({ status: 'SUCCESS' });
	}
	else {
		res.send({ status: 'ERROR', errors: errors });
	}
})

// get user
router.post('/search',async (req,res)=>{
    let errors = [];
	let body = req.body;

	if (typeof body === 'string') {
		try {
			body = JSON.parse(body);
		}
		catch (err) {
			errors.push('Unable to parse request body. ' + err.message);
		}
	}

    let searchCriteria ={};
    if(errors.length === 0){
        let keys = Object.keys(body);
        if (keys.includes('_id')) {
			searchCriteria._id = body._id;
		}

		if (keys.includes('email')) {
			searchCriteria.email = body.email.trim().toLowerCase();
		}
    }    
    searchCriteria.status =1
    let users = null;
    if(errors.length === 0){
        try {
			  users =  await MongoDB.getUsers(searchCriteria);
		}
		catch (err) {
			errors.push(`Unable to get user. ${err.message}`);
		}
    }

    if (errors.length === 0) {
		res.send({ status: 'SUCCESS', users:users });
	}
	else {
		res.send({ status: 'ERROR', errors: errors });
	}
})

router.post('/login', async (req,res)=>{
	let errors = [];
	let body = req.body;

	if (typeof body === 'string') {
		try {
			body = JSON.parse(body);
		}
		catch (err) {
			errors.push('Unable to parse request body. ' + err.message);
		}
	}

    let searchCriteria ={}, password;
    if(errors.length === 0){
        let keys = Object.keys(body);
		if (keys.includes('email')) {
			searchCriteria.email = body.email.trim().toLowerCase();
		}else{
			errors.push("Email should be provided in the request body.")
		}
		if (keys.includes('password')) {
			password = body.password.trim();
		}else{
			errors.push("Password should be provided in the request body.")
		}
    }    
    searchCriteria.status =1
    let users =null;
    if(errors.length === 0){
        try {
			  users =  await MongoDB.getUsers(searchCriteria);
		}
		catch (err) {
			errors.push(`Unable to get user. ${err}`);
		}
    }

	if(errors.length === 0){
		if(users.length === 0){
			errors.push("Email not Found. Please register!")
		}else{
			let isPassword = bcrypt.compareSync(password, users[0].password);
		if(!isPassword){
			errors.push("Password do not match. Please try again. ")
		}
		}
	}

	if (errors.length === 0) {
		const token = jwt.sign(users[0], process.env.JWT_SECRET_KEY);
		res.send({ status: 'SUCCESS', users:users, token });
	}
	else {
		res.send({ status: 'ERROR', errors: errors });
	}
})


module.exports = router;
