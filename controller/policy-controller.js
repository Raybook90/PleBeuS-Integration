const PolicyRepository = require('../repositories/policy-repository');
const BlockchainRepository = require('../repositories/blockchain-repository');
const UserRepository = require('../repositories/user-repository');
const policySelector = require('../business-logic/policy-selector');
const blockchainSelector = require('../business-logic/blockchain-selector');
const policyValidator = require('../business-logic/policy-validator');
const userCostUpdater = require('../business-logic/user-cost-updater');
const util = require('../util');
const constants = require('../constants');

module.exports.listPoliciesJSON = async (req, res) => {
    req.query.format = 'json';
    await listPolicies(req,res);
};

module.exports.listPolicies = async (req, res) => {
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
            return res.status(error.statusCode).render('error', {error: error})
        }
        // update cost thresholds if needed
        await userCostUpdater.costThresholdUpdater(user);
        let policies = await PolicyRepository.getPoliciesByUsername(username);
        if (policies && policies.length !== 0) {
            await policySelector.selectPolicy(policies, user);
        }
        policies = util.sortPoliciesByPriority(policies);

        if (req.query.format === 'json' || req.isJsonRequest) {
            return res.status(200).send(policies);
        }

        return res.status(200).render('policies', {policies, username});

    } catch (err) {
        console.error(err);
        return res.status(500).render('error', {error: err});
    }

};

module.exports.editPolicy = async (req, res) => {
    try {
        const username = req.query.username;
        const blockchains = await BlockchainRepository.getAllBlockchains();
        const user = await UserRepository.getUserByName(username);
        let currency = user ? user.currency : '';
        const choosableParams = util.cleanNumericalParams(blockchains);
        let policy = {};
        if (req.query.id) {
            policy = await PolicyRepository.getPolicyById(req.query.id);
            currency = user ? user.currency : policy.currency;
        } else {
            policy = username ? util.buildPolicy(null, username) : util.buildPolicy();
        }

        //In case the user does not have a default policy, force him to create one
        const defaultPolicy = await PolicyRepository.getPoliciesByUsernameAndInterval(policy.username, constants.intervals.DEFAULT);
        if (!defaultPolicy || defaultPolicy.length === 0 || policy.interval === constants.intervals.DEFAULT) {
            return res.status(200).render('default-policy', {policy, choosableParams, blockchains, currency});
        } else {
            return res.status(200).render('policy', {policy, choosableParams, blockchains, currency});
        }
    } catch (err) {
        console.error(err);
        return res.status(500).render('error', {error: err})
    }
};

module.exports.listBlockchains = async (req, res) => {
    try {
        const blockchains = await BlockchainRepository.getAllBlockchains();
        return res.status(200).send(blockchains);
    } catch (err) {
        console.error(err);
        return res.status(500).render('error', {error: err})
    }
};

module.exports.savePolicy = async (req, res) => {
    if (!req.body.username) {
        const error = new Error("No username provided");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }
    
    const providedPolicy = util.buildPolicy(req.body);
    //console.log(providedPolicy)
    const user = await UserRepository.getUserByName(providedPolicy.username);

    // Check policy interval conflicts
    if (user) {
        try {
            let userPolicies = await PolicyRepository.getPoliciesByUsername(providedPolicy.username);
            await policyValidator.validatePolicy(userPolicies, providedPolicy, user);
        } catch (err) {
            return res.status(err.statusCode).send({statusCode: err.statusCode, message: err.message})
        }

    }

    try {
        // test for Policy conflicts
        await blockchainSelector.selectBlockchainFromPolicy(providedPolicy);
    } catch (err) {
        return res.status(err.statusCode).send({statusCode: err.statusCode, message: err.message})
    }

    if (req.body._id) {
        try {
            const updatedPolicy = await PolicyRepository.getPolicyAndUpdate(req.body._id, providedPolicy);

            // if user does not exist, create user
            if (!user || user.length === 0) {
                await UserRepository.createUser(providedPolicy.username, providedPolicy.currency);
            }
            return res.status(201).send({policy: updatedPolicy});
        } catch (err) {
            const statusCode = err.statusCode || 500;
            return res.status(statusCode).send({statusCode, message: err.message})
        }
    } else {
        try {
            const createdPolicy = await PolicyRepository.createPolicy(providedPolicy);

            // if user does not exist, create user
            if (!user || user.length === 0) {
                await UserRepository.createUser(providedPolicy.username, providedPolicy.currency);
            }
            return res.status(201).send({policy: createdPolicy});
        } catch (err) {
            console.error(err);
            const statusCode = err.statusCode || 500;
            return res.status(statusCode).send({statusCode, message: err.message})
        }
    }
};

module.exports.deletePolicy = async (req, res) => {
    const policyId = req.params.id;

    if (policyId) {
        try {
            const policyToBeDeleted = await PolicyRepository.getPolicyById(policyId);
            if (policyToBeDeleted.interval === constants.intervals.DEFAULT) {
                const error = new Error('Default policies cannot be deleted');
                error.statusCode = 400;
                return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
            }
            await PolicyRepository.deletePolicy(policyId);
            return res.status(200).send({username: policyToBeDeleted.username, message: 'Policy deleted Successfully'});
        } catch (err) {
            console.error(err);
            return res.status(500).render('error', {error: err});
        }
    } else {
        return res.status(400).render('error', {error: 'No Policy Id provided'});
    }
};
