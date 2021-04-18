const constants = require('../constants');
const ratesAPI = require('../api/bc-rates');
const bcCosts = require('../api/bc-fees');
const util = require('../util');
const transformUtil = require('../util/unit-transformations');

//TODO: re-enable second source
async function calculateCostForBlockchain(bcKey, blockchainRates, profile = 'high') {
    if (util.isTransactionFeeFreeBlockchain(bcKey)) {
        return {[bcKey]: 0};
    }
    if (bcKey === constants.blockchains.BTC.nameShort) {
        const costOne = await bcCosts.fetchBTCFeesInBTCPerByteBCFees();
        //const costTwo = await bcCosts.fetchBTCFeesInBTCPerByteBlockCypher();
        //const costInBTC = transformUtil.avgCost(costOne, costTwo);
        // convert to money
        const costs = {};
        Object.keys(costOne).map((profile) => {
            costs[profile] = costOne[profile] * blockchainRates[bcKey];
        });
        // cost per Byte
        return {[bcKey]: costs[profile]};
    }
    if (bcKey === constants.blockchains.ETH.nameShort) {
        //const costOne = await bcCosts.fetchETHFeesPerGasBlockCypher();
        const costTwo = await bcCosts.fetchETHFeesPerGasEtherchain();
        //const costInETH = transformUtil.avgCost(costOne, costTwo);
        // convert to money
        const costs = {};
        Object.keys(costTwo).map((profile) => {
            costs[profile] = costTwo[profile] * blockchainRates[bcKey] * constants.exchanges.GAS_PER_BYTE;
        });
        // cost per Byte
        return {[bcKey]: costs[profile]};
    }
    if (bcKey === constants.blockchains.XLM.nameShort) {
        // cost per operation
        return {[bcKey]: 0.00001 * blockchainRates[bcKey]};
    }
    //eos api is deprecated
    /*
    if (bcKey === constants.blockchains.EOS.nameShort) {
        const ramCost = await bcCosts.fetchRAMPriceInEOS();
        // cost per Byte
        return {[bcKey]: ramCost * blockchainRates[bcKey]}
    }*/
    return {[bcKey]: 0};
}

async function calculateCosts(blockchainRates) {
    let blockchainCosts;
    const costs = {};
    await Promise.all(
        Object.keys(blockchainRates).map(async bcKey => {
            blockchainCosts = await calculateCostForBlockchain(bcKey, blockchainRates);
            costs[bcKey] = blockchainCosts[bcKey];
        })
    );
    return costs;
}

async function calculateCostForBlockchainViaAPI(currency, bcKey, bytes = 1, profile = 'low') {
    if (util.isTransactionFeeFreeBlockchain(bcKey)) {
        return {[bcKey]: 0};
    }
    const blockchainRates = await ratesAPI.fetchBlockchainCost(currency, bcKey);
    return calculateCostForBlockchain(bcKey, blockchainRates, bytes, profile)
}

function multiplyWithBytes(costPerByte, bytes) {
    const costs = {};
    Object.keys(costPerByte).forEach((costPerByteKey) => {
        // since XLM does costs per operation and not per byte just do not multiply with bytes
        if (costPerByteKey === constants.blockchains.XLM.nameShort) {
            costs[costPerByteKey] = costPerByte[costPerByteKey] + constants.baseTransactionCost;
        } else {
            costs[costPerByteKey] = costPerByte[costPerByteKey] * bytes + constants.baseTransactionCost;
        }
    });
    return costs;
}

module.exports = {
    calculateCostForBlockchainViaAPI,
    calculateCosts,
    multiplyWithBytes,
};
