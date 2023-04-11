var express = require('express');
var router = express.Router();
var MongoDB = require('./../routes/database');
const { protected } = require("./middleware/auth.middleware.js");

router.post('/insert', protected, async (req,res)=>{
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

    let dates=[], book_user, status =1, room_id;
    if(errors.length === 0){
        let keys = Object.keys(body);
		if (keys.includes('dates')) {
			dates = body.dates;
		}else {
			errors.push('Dates should be provided in the request body.');
		}

        if (keys.includes('book_user')) {
			book_user = body.book_user;
		}else {
			errors.push('Booked user id should be provided in the request body.');
		}

        if (keys.includes('room_id')) {
			room_id = body.room_id;
		}else {
			errors.push('Room id should be provided in the request body.');
		}

      
    }


    if(errors.length === 0){
        let document = {dates, book_user, room_id, status};
        try {
			    await MongoDB.createBooking(document);
		}
		catch (err) {
			errors.push(`Unable to add House. ${err.message}`);
		}
    }

    if (errors.length === 0) {
		res.send({ status: 'SUCCESS' });
	}
	else {
		res.send({ status: 'ERROR', errors: errors });
	}
});



// Update booking
router.post('/update', protected, async function (req, res, next) {
	let body = req.body;
	let errors = [];

	if (typeof body === 'string') {
		try {
			body = JSON.parse(body);
		}
		catch (err) {
			errors.push(`Unable to parse request body. ${err.message}`);
		}
	}

	let searchCriteria = {}, updatedData = {};
    if (errors.length === 0) {
		let keys = Object.keys(body);

		if (keys.includes('id')) {
			searchCriteria._id = body.id;
        }
        if (keys.includes('dates')) {
			updatedData.dates = body.dates;
		}
        if (keys.includes('status')) {
			updatedData.status = body.status;
		}
    }
    
    let results;
	if (errors.length === 0) {
		try {
			results = await MongoDB.updateBooking(searchCriteria, updatedData);
		}
		catch (err) {
			errors.push(`Unable to update user. ${err.message}`);
		}
	}

	if (errors.length === 0) {
		res.send({ status: 'SUCCESS', results: results });
	}
	else {
		res.send({ status: 'ERROR', errors: errors });
	}
}); 

module.exports = router;
