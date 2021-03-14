const constants = require('../constants');
const {DAILY, WEEKLY, MONTHLY, YEARLY} = constants.intervals;
const {ECONOMIC, PERFORMANCE} = constants.costProfiles;
const util = require('../util');

function getHighestCostThresholdForInterval(policies, interval) {
    if (!policies || policies.length === 0) {
        return 0;
    }
    const policiesForInterval = policies.filter(policy => policy.interval === interval);
    return Math.max.apply(Math, policiesForInterval.map(policy => {
        return policy.cost;
    }))
}

function getStatsForPolicy(policy, transactions) {
    const policyStats = {
        policyId: policy._id,
        cost: 0,
        transactions: 0,
        costThreshold: policy.cost,
    };
    const relevantTransactions = transactions.filter(transaction => transaction.policyId.equals(policy._id));
    relevantTransactions.forEach((transaction) => {
        policyStats.cost += transaction.cost;
        policyStats.transactions++;
    });

    return policyStats
}

function buildPolicyStats(policies, transactions) {
    const policyStats = [];
    if (!policies || policies.length === 0) {
        return policyStats;
    }

    policies.forEach((policy, index) => {
        policyStats[index] = getStatsForPolicy(policy, transactions);
    });

    return policyStats;

}

function getStatsForBlockchain(blockchain, transactions) {
    const blockchainStats = {
        nameShort: blockchain.nameShort,
        economicTransactions: 0,
        performanceTransactions: 0
    };

    const relevantTransactions = transactions.filter(transaction => transaction.blockchain === blockchain.name);
    relevantTransactions.forEach((transaction) => {
        if (transaction.costProfile === ECONOMIC) {
            blockchainStats.economicTransactions++;
        }

        if (transaction.costProfile === PERFORMANCE) {
            blockchainStats.performanceTransactions++;
        }
    });

    return blockchainStats
}


function buildBlockchainStats(blockchains, transactions) {
    const blockchainStats = [];
    if (!blockchains || blockchains.length === 0) {
        return blockchainStats;
    }

    blockchains.forEach((blockchain, index) => {
        blockchainStats[index] = getStatsForBlockchain(blockchain, transactions);
    });

    return blockchainStats;
}

function getStatsForInterval(interval, transactions) {
    const intervalStats = {
        interval: interval,
        BTC: 0,
        ETH: 0,
        XLM: 0,
        EOS: 0,
        MIOTA: 0,
        HYP: 0,
        MLC: 0,
        PSG: 0,
        NEO: 0,
    };
    const relevantTransactions = transactions.filter(transaction => transaction.interval === interval);
    relevantTransactions.forEach((transaction) => {
        if (transaction.blockchain === constants.blockchains.BTC.name) {
            intervalStats.BTC++;
        }
        if (transaction.blockchain === constants.blockchains.ETH.name) {
            intervalStats.ETH++;
        }
        if (transaction.blockchain === constants.blockchains.XLM.name) {
            intervalStats.XLM++;
        }
        if (transaction.blockchain === constants.blockchains.EOS.name) {
            intervalStats.EOS++;
        }
        if (transaction.blockchain === constants.blockchains.MIOTA.name) {
            intervalStats.MIOTA++;
        }
        if (transaction.blockchain === constants.blockchains.HYP.name) {
            intervalStats.HYP++;
        }
        if (transaction.blockchain === constants.blockchains.MLC.name) {
            intervalStats.MLC++;
        }
        if (transaction.blockchain === constants.blockchains.PSG.name) {
            intervalStats.PSG++;
        }
        if (transaction.blockchain === constants.blockchains.NEO.name) {
            intervalStats.NEO++;
        }
    });

    return intervalStats;
}

function buildIntervalStats(transactions) {
    const intervalStats = [];
    if (!transactions || transactions.length === 0) {
        return intervalStats;
    }

    Object.keys(constants.intervals).forEach((interval, index) => {
        intervalStats[index] = getStatsForInterval(constants.intervals[interval], transactions);
    });

    return intervalStats;
}


function getUserStats(user, policies, blockchains, transactions) {
    const stats = {
        costDaily: user.costDaily.cost,
        costWeekly: user.costWeekly.cost,
        costMonthly: user.costMonthly.cost,
        costYearly: user.costYearly.cost,
        activePolicyId: '',
        maxDailyCostThreshold: 0,
        maxWeeklyCostThreshold: 0,
        maxMonthlyCostThreshold: 0,
        maxYearlyCostThreshold: 0,
        policyStats: [],
        blockchainStats: [],
        intervalStats: [],
    };

    if (!policies || policies.length === 0) {
        return stats;
    }
    const sortedPolicies = util.sortPoliciesByPriority(policies);
    stats.maxDailyCostThreshold = getHighestCostThresholdForInterval(sortedPolicies, DAILY);
    stats.maxWeeklyCostThreshold = getHighestCostThresholdForInterval(sortedPolicies, WEEKLY);
    stats.maxMonthlyCostThreshold = getHighestCostThresholdForInterval(sortedPolicies, MONTHLY);
    stats.maxYearlyCostThreshold = getHighestCostThresholdForInterval(sortedPolicies, YEARLY);
    stats.policyStats = buildPolicyStats(sortedPolicies, transactions);
    stats.blockchainStats = buildBlockchainStats(blockchains, transactions);
    stats.intervalStats = buildIntervalStats(transactions);
    const activePolicy = sortedPolicies.find((policy) => policy.isActive);
    stats.activePolicyId = activePolicy ? activePolicy._id : '';

    return stats;
}

module.exports = {
    getUserStats
};