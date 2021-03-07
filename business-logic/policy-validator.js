const moment = require('moment');
const constants = require('../constants');
const util = require('../util');
const {DEFAULT, DAILY, WEEKLY, MONTHLY, YEARLY} = constants.intervals;
const {ECONOMIC, PERFORMANCE} = constants.costProfiles;

function isTimeFrameOverlapping(policy, otherPolicy) {
    // if policy is valid for 24h no other policy with same costperformance is valid
    if (policy.timeFrameStart === policy.timeFrameEnd || otherPolicy.timeFrameStart === otherPolicy.timeFrameEnd) {
        return true;
    }
    const startPolicy = moment(policy.timeFrameStart, 'hh:mm');
    const endPolicy = moment(policy.timeFrameEnd, 'hh:mm');
    const startOtherPolicy = moment(otherPolicy.timeFrameStart, 'hh:mm');
    const endOtherPolicy = moment(otherPolicy.timeFrameEnd, 'hh:mm');
    return startPolicy.isBetween(startOtherPolicy, endOtherPolicy, null, '[]')
        || endPolicy.isBetween(startOtherPolicy, endOtherPolicy, null, '[]');
}

function validateTimeFrameForCostProfile(policyToValidate, otherPolicies, costProfile) {
    let errorString = '';
    const otherPoliciesWithSameCostProfile = otherPolicies.filter(policy => policy.costProfile === costProfile);
    if (otherPoliciesWithSameCostProfile && otherPoliciesWithSameCostProfile.length > 0) {
        const conflictingPolicies = otherPoliciesWithSameCostProfile.filter(policy => isTimeFrameOverlapping(policyToValidate, policy));
        if (conflictingPolicies && conflictingPolicies.length > 0) {
            errorString = `A Policy with interval 
                    ${conflictingPolicies[0].interval} and cost profile ${conflictingPolicies[0].costProfile} 
                    has an overlapping time frame of ${conflictingPolicies[0].timeFrameStart} - 
                    ${conflictingPolicies[0].timeFrameEnd} <br/>`;

        }
    }
    return errorString;
}

function validateCostsForInterval(policyToValidate, otherPolicies, interval) {
    let errorString = '';
    const policiesToCompareTo = otherPolicies.filter(policy => policy.interval !== DEFAULT && policy.interval !== interval);
    if (policiesToCompareTo && policiesToCompareTo.length > 0) {
        const higherIntervals = util.getHigherIntervals(interval);
        const lowerIntervals = util.getLowerIntervals(interval);
        const policiesWithInvalidLowerCostThreshold = policiesToCompareTo.filter(policy => higherIntervals.includes(policy.interval) && policy.cost < policyToValidate.cost);
        const policiesWithInvalidHigherCostThreshold = policiesToCompareTo.filter(policy => lowerIntervals.includes(policy.interval) && policy.cost > policyToValidate.cost);
        if (policiesWithInvalidLowerCostThreshold.length > 0 || policiesWithInvalidHigherCostThreshold.length > 0) {
            policiesWithInvalidLowerCostThreshold.forEach((policy) => {
                errorString += `A policy with interval ${policy.interval} has a lower cost threshold of ${policy.cost} <br/> `;
            });
            policiesWithInvalidHigherCostThreshold.forEach((policy) => {
                errorString += `A policy with interval ${policy.interval} has a higher cost threshold of ${policy.cost} <br/> `;
            });

        }
    }
    return errorString;
}

function checkForErrors(policyToValidate, otherPolicies, interval) {
    let errorString = '';
    const otherPoliciesSameInterval = otherPolicies.filter(policy => policy.interval === interval);
    if (policyToValidate.costProfile === PERFORMANCE) {
        errorString = errorString + validateTimeFrameForCostProfile(policyToValidate, otherPoliciesSameInterval, PERFORMANCE);
    }
    if (policyToValidate.costProfile === ECONOMIC) {
        errorString = errorString + validateTimeFrameForCostProfile(policyToValidate, otherPoliciesSameInterval, ECONOMIC);
    }
    errorString = errorString + validateCostsForInterval(policyToValidate, otherPolicies, interval);
    if (errorString !== '') {
        const conflictError = new Error(`Policy conflicts detected: <br/> ${errorString}`);
        conflictError.statusCode = 400;
        throw conflictError
    }
    return errorString;
}

module.exports.validatePolicy = async (userPolicies, policyToValidate) => {
    const otherPolicies = userPolicies.filter(policy => !policy._id.equals(policyToValidate._id));

    // Only a single default policy is allowed
    if (policyToValidate.interval === DEFAULT) {
        const otherDefaultPolicies = otherPolicies.filter(policy => policy.interval === DEFAULT);
        if (otherDefaultPolicies && otherDefaultPolicies.length > 0) {
            const conflictError = new Error("Policy conflict detected: A default Policy for this user already exists");
            conflictError.statusCode = 400;
            throw conflictError;
        }
    }

    // Daily threshold policies need to have lower max cost than weekly, monthly and yearly
    if (policyToValidate.interval === DAILY) {
        return checkForErrors(policyToValidate, otherPolicies, DAILY);
    }

    // Weekly threshold policies need to have lower max cost than monthly and yearly and higher than daily
    if (policyToValidate.interval === WEEKLY) {
        return checkForErrors(policyToValidate, otherPolicies, WEEKLY);
    }

    if (policyToValidate.interval === MONTHLY) {
        return checkForErrors(policyToValidate, otherPolicies, MONTHLY);
    }

    if (policyToValidate.interval === YEARLY) {
        return checkForErrors(policyToValidate, otherPolicies, YEARLY);
    }

};