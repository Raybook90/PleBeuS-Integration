const PolicyRepository = require('../repositories/policy-repository');
const constants = require('../constants');
const moment = require('moment');

const {DAILY, WEEKLY, MONTHLY, YEARLY, DEFAULT} = constants.intervals;
const {ECONOMIC, PERFORMANCE} = constants.costProfiles;

function isPolicyInTimeFrame(policy) {
    if (policy.timeFrameStart === policy.timeFrameEnd) {
        return true;
    }
    const now = moment();
    const start = moment(policy.timeFrameStart, 'hh:mm');
    const end = moment(policy.timeFrameEnd, 'hh:mm');
    // start time could be after the end time (e.g. 17:01 - 07:59) and moment takes the current date as basis
    if (start.isAfter(end)) {
        end.add(1, 'days');
    }
    return now.isBetween(start, end, null, '[]');
}

async function retrieveActivePolicyForInterval(policies, costThreshold) {
    let activePolicy = null;
    const policiesInTimeFrame = policies.filter(policy => isPolicyInTimeFrame(policy));
    const policiesPerformance = policiesInTimeFrame.filter(policy => policy.costProfile === PERFORMANCE);
    const policiesEconomic = policiesInTimeFrame.filter(policy => policy.costProfile === ECONOMIC);

    for (let policy of policiesPerformance) {
        if (policy.cost >= costThreshold) {
            policy.isActive = true;
            await PolicyRepository.getPolicyAndUpdate(policy.id, policy);
            activePolicy = policy;
        }
    }

    if (activePolicy) {
        return activePolicy;
    }

    for (let policy of policiesEconomic) {
        if (policy.cost >= costThreshold) {
            policy.isActive = true;
            await PolicyRepository.getPolicyAndUpdate(policy.id, policy);
            activePolicy = policy;
        }
    }

    return activePolicy;
}

async function selectPolicy(policies, user) {
    // Mark all policies as inactive before setting the chosen one as active
    for (let policy of policies) {
        policy.isActive = false;
        await PolicyRepository.getPolicyAndUpdate(policy.id, policy);
    }

    const dailyPolicies = policies.filter(policy => policy.interval === DAILY);

    if (dailyPolicies && dailyPolicies.length > 0) {
        let activeDailyPolicy = await retrieveActivePolicyForInterval(dailyPolicies, user.costDaily.cost);
        if (activeDailyPolicy) {
            return activeDailyPolicy;
        }
    }

    const weeklyPolicy = policies.filter(policy => policy.interval === WEEKLY);

    if (weeklyPolicy) {
        let activeWeeklyPolicy = await retrieveActivePolicyForInterval(weeklyPolicy, user.costWeekly.cost);
        if (activeWeeklyPolicy) {
            return activeWeeklyPolicy;
        }
    }

    const monthlyPolicy = policies.filter(policy => policy.interval === MONTHLY);

    if (monthlyPolicy) {
        let activeMonthlyPolicy = await retrieveActivePolicyForInterval(monthlyPolicy, user.costMonthly.cost);
        if (activeMonthlyPolicy) {
            return activeMonthlyPolicy;
        }
    }

    const yearlyPolicy = policies.filter(policy => policy.interval === YEARLY);

    if (yearlyPolicy) {
        let activeYearlyPolicy = await retrieveActivePolicyForInterval(yearlyPolicy, user.costYearly.cost);
        if (activeYearlyPolicy) {
            return activeYearlyPolicy;
        }
    }

    const defaultPolicy = policies.filter(policy => policy.interval === DEFAULT);

    if (defaultPolicy) {
        defaultPolicy[0].isActive = true;
        await PolicyRepository.getPolicyAndUpdate(defaultPolicy.id, defaultPolicy);
        return defaultPolicy[0];
    }

    const conflictError = new Error("Policy conflict detected: No applicable policy found");
    conflictError.statusCode = 500;
    throw conflictError
}

module.exports = {
    selectPolicy,
};