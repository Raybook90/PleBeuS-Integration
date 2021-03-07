const BlockchainModel = require('../models/blockchain');

function getAllBlockchains() {
    return new Promise((resolve, reject) => {
        BlockchainModel.find({})
            .then(blockchains => {
                resolve(blockchains);
            })
            .catch(err => {
                console.error(err);
                reject(err)
            });
    })
}

function getBlockchainsByNameShort(nameShortArray) {
    return new Promise((resolve, reject) => {
        BlockchainModel.find({'nameShort': { $in: nameShortArray}})
            .then(blockchains => {
                resolve(blockchains);
            })
            .catch(err => {
                console.error(err);
                reject(err)
            });
    })
}

module.exports = {
    getAllBlockchains,
    getBlockchainsByNameShort,
};