const xlsx = require('node-xlsx');
const PolicyRepository = require('../repositories/policy-repository');
const UserRepository = require('../repositories/user-repository');
const BlockchainRepository = require('../repositories/blockchain-repository');
const dataExtractor = require('../business-logic/data-extractor');
const transactionMaker = require('../business-logic/transaction-maker');
const costCalculator = require('../business-logic/cost-calculator');
const userCostUpdater = require('../business-logic/user-cost-updater');
const util = require('../util');

module.exports.handleTransaction = async (req, res) => {
    const username = req.body.username;
    const minTemp = req.body.minTemp;
    const maxTemp = req.body.maxTemp;
    // check if user exists, otherwise return
    if (!username) {
        const error = new Error("No username provided");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }
    const user = await UserRepository.getUserByName(username);
    if (!user || user.length === 0) {
        const error = new Error(`No user with username ${username} found`);
        error.statusCode = 404;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }
    // update costs
    await userCostUpdater.costThresholdUpdater(user);

    if (req.file && req.body.data) {
        const error = new Error('Only on of xlsx file or data can be provided');
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }

    if (req.file) {
        // check if Temperature thresholds have been provided correctly
        const minMaxTempError = util.checkValidTemperatures(minTemp, maxTemp);
        if (minMaxTempError) {
            const error = new Error(minMaxTempError);
            error.statusCode = 400;
            return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
        }

        // get violation Data
        const sheets = xlsx.parse(req.file.buffer);
        const violationsData = dataExtractor.violationsExtractor(sheets, minTemp, maxTemp);
        try {
            const policies = await PolicyRepository.getPoliciesByUsername(username);
            if (!policies || policies.length === 0) {
                const error = new Error("No Policies Found with the provided username");
                error.statusCode = 404;
                return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
            }
            const transaction = await transactionMaker.makeTransactions(policies, user, violationsData);
            return res.status(201).send(transaction);
        } catch (err) {
            console.error(err);
            return res.status(err.statusCode).send({statusCode: err.statusCode, message: err.message})
        }
    }

    if (req.body.data) {
        const dataString = req.body.data;
        const data = dataExtractor.prepareStringData(dataString);

        try {
            const policies = await PolicyRepository.getPoliciesByUsername(username);
            if (!policies || policies.length === 0) {
                const error = new Error("No Policies Found with the provided username");
                error.statusCode = 404;
                return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
            }
            const transaction = await transactionMaker.makeTransactions(policies, user, data);
            return res.status(201).send(transaction);
        } catch (err) {
            console.error(err);
            return res.status(err.statusCode).send({statusCode: err.statusCode, message: err.message})
        }

    }
    const error = new Error(`No file or data hash provided`);
    error.statusCode = 400;
    return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})


};

module.exports.getBlockchainCost = async (req, res) => {
    const blockchainNameShort = req.params.blockchain;
    const currency = req.params.currency;
    if (!blockchainNameShort) {
        const error = new Error("No blockchain provided");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }

    try {
        const blockchain = await BlockchainRepository.getBlockchainsByNameShort(blockchainNameShort);
        if (!blockchain || blockchain.length === 0) {
            const error = new Error("No such blockchain found");
            error.statusCode = 400;
            return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
        }
        const costs = await costCalculator.calculateCostForBlockchainViaAPI(currency, blockchainNameShort);
        return res.status(200).send(costs);
    } catch (err) {
        return res.status(500).send(err)
    }
};