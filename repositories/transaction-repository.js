const TransactionModel = require('../models/transaction');

function getTransactionsByUsername(username) {
    return new Promise((resolve, reject) => {
        TransactionModel.find({'username': username})
            .then(queriedTransactions => {
                resolve(queriedTransactions)
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

function createTransaction(transaction) {
    return new Promise((resolve, reject) => {
        TransactionModel.create(transaction)
            .then(savedPolicy => {
                resolve(savedPolicy)
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

module.exports = {
    getTransactionsByUsername,
    createTransaction,
};