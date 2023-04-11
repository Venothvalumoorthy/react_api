var express = require('express');
var router = express.Router();
var MongoDB = require('./../routes/database');
const { protected } = require("./middleware/auth.middleware.js");

router.post('/insert',protected, async (req,res)=>{
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

    let name, address, images=[], status =1, owner;
    if(errors.length === 0){
        let keys = Object.keys(body);
		if (keys.includes('name')) {
			name = body.name.trim();
		}else {
			errors.push('Name should be provided in the request body.');
		}

        if (keys.includes('address')) {
			address = body.address;
		}else {
			errors.push('Address should be provided in the request body.');
		}

        if (keys.includes('owner')) {
			owner = body.owner;
		}else {
			errors.push('House owner should be provided in the request body.');
		}

        if (keys.includes('image')) {
			images.push(body.image.trim());
		}
    }


    if(errors.length === 0){
        let document = {name, address, owner, image, status};
        try {
			    await MongoDB.createHouse(document);
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


// get house
router.post('/search', protected, async (req,res)=>{
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

		if (keys.includes('owner')) {
			searchCriteria.owner = body.owner;
		}
    }    
    searchCriteria.status =1
    let houses = null;
    if(errors.length === 0){
        try {
            houses =  await MongoDB.getHouses(searchCriteria);
		}
		catch (err) {
			errors.push(`Unable to get houses. ${err.message}`);
		}
    }

    if (errors.length === 0) {
		res.send({ status: 'SUCCESS', houses:houses });
	}
	else {
		res.send({ status: 'ERROR', errors: errors });
	}
})


// Update existing house
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
        if (keys.includes('name')) {
			updatedData.name = body.name.trim();
		}
        if (keys.includes('address')) {
			updatedData.address = body.address;
		}
        if (keys.includes('status')) {
			updatedData.status = body.status;
		}
    }
    
    let results;
	if (errors.length === 0) {
		try {
			results = await MongoDB.updateHouse(searchCriteria, updatedData);
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

// create room
router.post('/rooms/insert', protected, async (req,res)=>{
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

    let name, num_beds, houseid,owner, floor_size="", images=[], status =1, amenities="",minimum_booking, maximum_booking;
    if(errors.length === 0){
        let keys = Object.keys(body);
		if (keys.includes('name')) {
			name = body.name.trim();
		}else {
			errors.push('Name should be provided in the request body.');
		}

        if (keys.includes('num_beds')) {
			num_beds = body.num_beds;
		}else {
			errors.push('Number of beds should be provided in the request body.');
		}

        if (keys.includes('houseid')) {
			houseid = body.houseid;
		}else {
			errors.push('Houseid should be provided in the request body.');
		}
        if (keys.includes('owner')) {
			owner = body.owner;
		}else {
			errors.push('Owner id should be provided in the request body.');
		}

        if (keys.includes('image')) {
			images.push(body.image.trim());
		}

        if (keys.includes('floor_size')) {
			floor_size = body.floor_size;
		}
        if (keys.includes('amenities')) {
			amenities = body.amenities;
		}
        if (keys.includes('maximum_booking')) {
			maximum_booking = body.maximum_booking;
		}
        if (keys.includes('minimum_booking')) {
			minimum_booking = body.minimum_booking;
		}
    }


    if(errors.length === 0){
        let document = {name, num_beds, houseid, images, status, floor_size, amenities, status, maximum_booking,minimum_booking};
        try {
			    await MongoDB.createRoom(document);
		}
		catch (err) {
			errors.push(`Unable to add Room. ${err.message}`);
		}
    }

    if (errors.length === 0) {
		res.send({ status: 'SUCCESS' });
	}
	else {
		res.send({ status: 'ERROR', errors: errors });
	}
});


// get room
router.post('/rooms/search', protected, async (req,res)=>{
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

		if (keys.includes('houseid')) {
			searchCriteria.houseid = body.houseid;
		}
    }    
    searchCriteria.status =1
    let rooms = null;
    if(errors.length === 0){
        try {
            rooms =  await MongoDB.getRooms(searchCriteria);
		}
		catch (err) {
			errors.push(`Unable to get Rooms. ${err.message}`);
		}
    }

    if (errors.length === 0) {
		res.send({ status: 'SUCCESS', rooms:rooms });
	}
	else {
		res.send({ status: 'ERROR', errors: errors });
	}
})



// Update existing rooms
router.post('/rooms/update', protected, async function (req, res, next) {
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
        if (keys.includes('name')) {
			updatedData.name = body.name.trim();
		}
        if (keys.includes('num_beds')) {
			updatedData.num_beds = body.num_beds;
		}
        if (keys.includes('floor_size')) {
			updatedData.floor_size = body.floor_size;
		}
        if (keys.includes('floor_size')) {
			updatedData.amenities = body.amenities;
		}
        if (keys.includes('maximum_booking')) {
			updatedData.maximum_booking = body.maximum_booking;
		}
        if (keys.includes('status')) {
			updatedData.status = body.status;
		}
    }
    
    let results;
	if (errors.length === 0) {
		try {
			results = await MongoDB.updateRooms(searchCriteria, updatedData);
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