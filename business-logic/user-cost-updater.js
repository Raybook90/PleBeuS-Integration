const moment = require('moment');
const UserRepository = require('../repositories/user-repository');

async function costThresholdUpdater(user) {
    const dateLastResetForCostDaily = user.costDaily.lastReset;
    const dateLastResetForCostWeekly = user.costWeekly.lastReset;
    const dateLastResetForCostMonthly = user.costMonthly.lastReset;
    const dateLastResetForCostYearly = user.costYearly.lastReset;
    const now = Date.now();
    let isUpdated = false;

    if (moment(now).subtract(1, 'd').isAfter(moment(dateLastResetForCostDaily))) {
        isUpdated = true;
        user.costDaily.cost = 0;
        user.costDaily.lastReset = Date.now();
    }
    if (moment(now).subtract(1, 'w').isAfter(moment(dateLastResetForCostWeekly))) {
        isUpdated = true;
        user.costWeekly.cost = 0;
        user.costWeekly.lastReset = Date.now();
    }
    if (moment(now).subtract(1, 'M').isAfter(moment(dateLastResetForCostMonthly))) {
        isUpdated = true;
        user.costMonthly.cost = 0;
        user.costMonthly.lastReset = Date.now();
    }
    if (moment(now).subtract(1, 'y').isAfter(moment(dateLastResetForCostYearly))) {
        isUpdated = true;
        user.costYearly.cost = 0;
        user.costYearly.lastReset = Date.now();
    }

    if (isUpdated) {
        await UserRepository.getUserAndUpdate(user._id, user);
    }

}

async function addToUserCosts(user, costs) {
    user.costDaily.cost = user.costDaily.cost + costs;
    user.costWeekly.cost = user.costWeekly.cost + costs;
    user.costMonthly.cost = user.costMonthly.cost + costs;
    user.costYearly.cost = user.costYearly.cost + costs;

    await UserRepository.getUserAndUpdate(user._id, user);
}

module.exports = {
    costThresholdUpdater,
    addToUserCosts
};