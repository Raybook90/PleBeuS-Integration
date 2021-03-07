const UserRepository = require('../repositories/user-repository');
const PolicyRepository = require('../repositories/policy-repository');
const TransactionRepository = require('../repositories/transaction-repository');
const BlockchainRepository = require('../repositories/blockchain-repository');
const userStats = require('../business-logic/user-stats');

module.exports.checkIfUserDoesNotExist = async (req, res) => {
    const username = req.params.username;
    if (!username) {
        const error = new Error("No username provided");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }

    try {
        let user = await UserRepository.getUserByName(username);
        if (!user || user.length === 0) {
            return res.status(200).send({success: true})
        }

        const error = new Error("User already exists, Please choose different name");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})

    } catch (err) {
        console.error(err);
        return res.status(500).render('error', {error: err});
    }
};

module.exports.getUserStats = async (req, res) => {
    const username = req.params.username;
    if (!username) {
        const error = new Error("No username provided");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }

    try {
        const user = await UserRepository.getUserByName(username);
        if (!user || user.length === 0) {
            const error = new Error("User does not exist");
            error.statusCode = 404;
            return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
        }
        const policies = await PolicyRepository.getPoliciesByUsername(username);
        const transactions = await TransactionRepository.getTransactionsByUsername(username);
        const blockchains = await BlockchainRepository.getAllBlockchains();
        const stats = userStats.getUserStats(user, policies, blockchains, transactions);
        return res.status(200).send(stats);

    } catch (err) {
        console.error(err);
        return res.status(500).send({message: error.message})
    }
};