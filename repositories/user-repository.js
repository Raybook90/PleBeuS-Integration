const UserModel = require('../models/user');

function getUserByName(username) {
    return new Promise((resolve, reject) => {
        UserModel.findOne({'username': username})
            .then(queriedUser => {
                resolve(queriedUser)
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

function createUser(username, currency) {
    return new Promise((resolve, reject) => {
        UserModel.create({'username': username, 'currency': currency})
            .then(savedPolicy => {
                resolve(savedPolicy)
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

function getUserAndUpdate(id, user) {
    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({'_id': id}, user, {upsert: true})
            .then(() => {
                resolve(user);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

module.exports = {
    getUserByName,
    createUser,
    getUserAndUpdate,
};