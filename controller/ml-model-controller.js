const xlsx = require('node-xlsx');
const PolicyRepository = require('../repositories/policy-repository');
const UserRepository = require('../repositories/user-repository');
const BlockchainRepository = require('../repositories/blockchain-repository');
const dataExtractor = require('../business-logic/data-extractor');
const MLselectionMaker = require('../business-logic/ml-blockchain-selector');
const costCalculator = require('../business-logic/cost-calculator');
const userCostUpdater = require('../business-logic/user-cost-updater');
const util = require('../util');

module.exports.handleMLSelection = async (req, res) => {
    const username = req.body.username;

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
            const selection = await MLselectionMaker.makeSelection(policies, user, data);
            return res.status(201).send(selection);
        } catch (err) {
            console.error(err);
            return res.status(err.statusCode).send({statusCode: err.statusCode, message: err.message})
        }

    }
    const error = new Error(`No data hash provided`);
    error.statusCode = 400;
    return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})


};
/*
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
*/