const constants = require('../constants');
const moment = require('moment');

const {DEFAULT, DAILY, WEEKLY, MONTHLY, YEARLY} = constants.intervals;
const {PERFORMANCE, ECONOMIC} = constants.costProfiles;

function buildPolicy(requestBody = null, username) {
    const policy = {};
    const policyUsername = username ? username : '';
    if (!requestBody) {
        policy.username = policyUsername;
        policy.preferredBC = [];
        policy.currency = '';
        policy.cost = 0;
        policy.bcType = 'indifferent';
        policy.bcSmartContract = false;
        policy.bcTuringComplete = false;
        policy.popularity = 'low'
        policy.interval = '';
        policy.bcBlockTime = 0;
        policy.bcDataSize = 0;
        policy.split = false;
        policy.costProfile = '';
        policy.timeFrameStart = '00:00';
        policy.timeFrameEnd = '00:00';
        policy.useMachineLearning = false;
    } else if (requestBody.interval === DEFAULT) {
        policy.username = requestBody.username;
        policy.preferredBC = requestBody.preferredBC || [];
        policy.bcType = requestBody.bcType;
        policy.interval = DEFAULT;
        policy.bcSmartContract = requestBody.bcSmartContract ==='true';
        policy.bcTuringComplete = requestBody.bcTuringComplete === 'true';
        policy.popularity = requestBody.popularity;
        policy.currency = requestBody.currency;
        policy.bcTps = parseInt(requestBody.bcTps, 10);
        policy.bcBlockTime = parseInt(requestBody.bcBlockTime, 10);
        policy.bcDataSize = parseInt(requestBody.bcDataSize, 10);
        policy.split = requestBody.split === 'true';
        policy.costProfile = requestBody.costProfile;
        policy.useMachineLearning = requestBody.useMachineLearning === 'true';
        if (requestBody._id) {
            policy._id = requestBody._id;
        }
    } else {
        policy.username = requestBody.username;
        policy.preferredBC = requestBody.preferredBC || [];
        policy.currency = requestBody.currency;
        policy.cost = parseFloat(requestBody.cost);
        policy.bcType = requestBody.bcType;
        policy.bcSmartContract = requestBody.bcSmartContract === 'true';
        policy.bcTuringComplete = requestBody.bcTuringComplete === 'true';
        policy.popularity = requestBody.popularity;
        policy.interval = requestBody.interval;
        policy.bcTps = parseInt(requestBody.bcTps, 10);
        policy.bcBlockTime = parseInt(requestBody.bcBlockTime, 10);
        policy.bcDataSize = parseInt(requestBody.bcDataSize, 10);
        policy.split = requestBody.split === 'true';
        policy.costProfile = requestBody.costProfile;
        policy.timeFrameStart = requestBody.timeFrameStart;
        policy.timeFrameEnd = requestBody.timeFrameEnd;
        policy.useMachineLearning = requestBody.useMachineLearning === 'true';
        if (requestBody._id) {
            policy._id = requestBody._id;
        }
    }

    return policy;
}

function cleanNumericalParams(blockchains) {
    const tps = [];
    const blockTime = [];
    const maxTrxSize = [];

    blockchains.forEach(blockchain => {
        tps.push(blockchain.tps);
        blockTime.push(blockchain.blockTime);
        maxTrxSize.push(blockchain.maxTrxSize);
    });

    tps.sort((a, b) => a - b);
    blockTime.sort((a, b) => a - b);
    maxTrxSize.sort((a, b) => a - b);

    return {
        tps: [...new Set(tps)],
        blockTime: [...new Set(blockTime)],
        maxTrxSize: [...new Set(maxTrxSize)],
        maxBlockTime: blockTime[blockTime.length - 1]
    }
}

function sortByTimeFrame(policies) {
    // if there is none or only one policy nothing needs to be sorted
    if (policies.length < 2) {
        return policies;
    }

    return policies.sort((a, b) => moment(a.timeFrameStart, 'hh.mm') - moment(b.timeFrameStart, 'hh.mm'));
}

function sortPoliciesForInterval(policies) {
    const performancePolicies = policies.filter(policy => policy.costProfile === PERFORMANCE);
    const economicPolicies = policies.filter(policy => policy.costProfile === ECONOMIC);
    const sortedPerformancePolicies = sortByTimeFrame(performancePolicies);
    const sortedEconomicPolicies = sortByTimeFrame(economicPolicies);
    return [...sortedPerformancePolicies, ...sortedEconomicPolicies]
}

function sortPoliciesByPriority(policies) {
    const sortedDailyPolicies = sortPoliciesForInterval(policies.filter(policy => policy.interval === DAILY));
    const sortedWeeklyPolicies = sortPoliciesForInterval(policies.filter(policy => policy.interval === WEEKLY));
    const sortedMonthlyPolicies = sortPoliciesForInterval(policies.filter(policy => policy.interval === MONTHLY));
    const sortedYearlyPolicies = sortPoliciesForInterval(policies.filter(policy => policy.interval === YEARLY));
    const defaultPolicy = policies.filter(policy => policy.interval === DEFAULT);

    return [...sortedDailyPolicies, ...sortedWeeklyPolicies, ...sortedMonthlyPolicies, ...sortedYearlyPolicies, ...defaultPolicy];

}

function getLowerIntervals(threshold) {

    if (threshold === DAILY) {
        return [];
    }

    if (threshold === WEEKLY) {
        return [DAILY];
    }

    if (threshold === MONTHLY) {
        return [DAILY, WEEKLY];
    }

    if (threshold === YEARLY) {
        return [DAILY, WEEKLY, MONTHLY];
    }

    return [];
}

function getHigherIntervals(threshold) {

    if (threshold === DAILY) {
        return [WEEKLY, MONTHLY, YEARLY];
    }

    if (threshold === WEEKLY) {
        return [MONTHLY, YEARLY];
    }

    if (threshold === MONTHLY) {
        return [YEARLY];
    }

    if (threshold === YEARLY) {
        return [];
    }

    return [];
}

function isTransactionFeeFreeBlockchain(bcType) {
    return bcType === constants.blockchains.PSG.nameShort
        || bcType === constants.blockchains.MLC.nameShort
        || bcType === constants.blockchains.MIOTA.nameShort
        || bcType === constants.blockchains.HYP.nameShort;
}

function checkValidTemperatures(minTemp, maxTemp) {
    let error;
    if (!minTemp || !maxTemp) {
        error = 'minTemp or MaxTemp missing'
    }

    if (Number.isNaN(minTemp) || Number.isNaN(maxTemp)) {
        error = 'minTemp or MaxTemp is not an integer'
    }

    if (minTemp > maxTemp) {
        error = 'minTemp has an invalid higher value than MaxTemp'
    }

    return error;
}

function addPrivateRatesToObject(blockchainRates) {
    const allBlockchainRates = {...blockchainRates};
    const allBlockchainKeys = Object.keys(constants.blockchains);
    allBlockchainKeys.forEach((blockchainKey) => {
        if (!allBlockchainRates.hasOwnProperty(blockchainKey)) {
            allBlockchainRates[blockchainKey] = 0;
        }
    });

    return allBlockchainRates;
}

function publicBlockchainsForCostRequest() {
    let publicBlockchains = [];
    Object.keys(constants.blockchains).forEach((bcKey) => {
        if (constants.blockchains[bcKey].type === constants.blockchainTypes.PUBLIC) {
            publicBlockchains.push(constants.blockchains[bcKey].nameShort);
        }
    });
    return publicBlockchains.join();
}

module.exports = {
    buildPolicy,
    cleanNumericalParams,
    sortPoliciesByPriority,
    getLowerIntervals,
    getHigherIntervals,
    isTransactionFeeFreeBlockchain,
    checkValidTemperatures,
    addPrivateRatesToObject,
    publicBlockchainsForCostRequest,
};