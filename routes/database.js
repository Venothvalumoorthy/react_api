var mongo = require('mongodb');
const uri = process.env.mongoUrl;

let userCollections, roomCollections, houseCollections, bookingCollections;

module.exports.init = function () {
    return new Promise(async (resolve, reject) => {
        try {
            const conn = await new mongo.MongoClient(uri, { useUnifiedTopology: true }).connect();
            if (!conn) {
                return reject(err);
            }
            userCollections = conn.db(process.env.dbName).collection("users");
            houseCollections = conn.db(process.env.dbName).collection("houses");
            roomCollections = conn.db(process.env.dbName).collection("rooms");
            bookingCollections = conn.db(process.env.dbName).collection("bookings");
            resolve(true);
        } catch (err) {
            reject(err);
        }
    })
}

module.exports.createUser = function (document) {
	return new Promise((resolve, reject) => {
		try {
			userCollections.insertOne(document).then(value => {
				resolve(value);
			}).catch(reason => {
				reject(reason);
			});
		}
		catch (err) {
			reject(err);
		}
	});
}

module.exports.getUsers = function (searchCriteria) {
	if (searchCriteria._id) {
		searchCriteria._id = new mongo.ObjectId(searchCriteria._id);
	}
		return new Promise((resolve, reject) => {
			userCollections.find(searchCriteria).toArray().then(value => {
				resolve(value);
			}).catch(reason =>{
				reject(reason)
			});
	})
}

module.exports.createHouse = function (document) {
	if (document.owner) {
		document.owner = new mongo.ObjectId(document.owner);
	}
	return new Promise((resolve, reject) => {
		try {
			houseCollections.insertOne(document).then(value => {
				resolve(value);
			}).catch(reason => {
				reject(reason);
			});
		}
		catch (err) {
			reject(err);
		}
	});
}

module.exports.getHouses = function (searchCriteria = {}) {
	if (searchCriteria._id) {
		searchCriteria._id = new mongo.ObjectId(searchCriteria._id);
	}
	if (searchCriteria.owner) {
		searchCriteria.owner = new mongo.ObjectId(searchCriteria.owner);
	}

	return new Promise((resolve, reject) => {
		houseCollections.find(searchCriteria).toArray(function (err, docs) {
			if (err) {
				reject(err);
			}
			else {
				resolve(docs);
			}
		});
	});
}

module.exports.updateHouse = function (searchCriteria, updatedData) {
	if (searchCriteria._id) {
		searchCriteria._id = new mongo.ObjectId(searchCriteria._id);
	}
	
	return new Promise((resolve, reject) => {
		houseCollections.updateMany(searchCriteria, { $set: updatedData }, function (err, result) {
			if (err) {
				reject(err);
			}
			else {
				resolve(result);
			}
		});
	});
}

module.exports.createRoom = function (document) {
	if (document.owner) {
		document.owner = new mongo.ObjectId(document.owner);
	}
	return new Promise((resolve, reject) => {
		try {
			roomCollections.insertOne(document).then(value => {
				resolve(value);
			}).catch(reason => {
				reject(reason);
			});
		}
		catch (err) {
			reject(err);
		}
	});
}

module.exports.getRooms = function (searchCriteria = {}) {
	if (searchCriteria._id) {
		searchCriteria._id = new mongo.ObjectId(searchCriteria._id);
	}
	if (searchCriteria.owner) {
		searchCriteria.owner = new mongo.ObjectId(searchCriteria.owner);
	}
	console.log(searchCriteria)
	return new Promise((resolve, reject) => {
		roomCollections.find(searchCriteria).toArray().then(value => {
			resolve(value);
		}).catch(reason =>{
			reject(reason)
		});
	});
}

module.exports.updateRooms = function (searchCriteria, updatedData) {
	if (searchCriteria._id) {
		searchCriteria._id = new mongo.ObjectId(searchCriteria._id);
	}
	
	return new Promise((resolve, reject) => {
		roomCollections.updateMany(searchCriteria, { $set: updatedData }, function (err, result) {
			if (err) {
				reject(err);
			}
			else {
				resolve(result);
			}
		});
	});
}

module.exports.createBooking = function (document) {
	if (document.book_user) {
		document.book_user = new mongo.ObjectId(document.book_user);
	}
	if (document.room_id) {
		document.room_id = new mongo.ObjectId(document.room_id);
	}
	return new Promise((resolve, reject) => {
		try {
			bookingCollections.insertOne(document).then(value => {
				resolve(value);
			}).catch(reason => {
				reject(reason);
			});
		}
		catch (err) {
			reject(err);
		}
	});
}

module.exports.updateBooking = function (searchCriteria, updatedData) {
	if (searchCriteria._id) {
		searchCriteria._id = new mongo.ObjectId(searchCriteria._id);
	}
	
	return new Promise((resolve, reject) => {
		bookingCollections.updateMany(searchCriteria, { $set: updatedData }, function (err, result) {
			if (err) {
				reject(err);
			}
			else {
				resolve(result);
			}
		});
	});
}