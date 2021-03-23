const BlockchainRepository = require('../repositories/blockchain-repository');
const constants = require('../constants');
const request = require('request-promise');

function getBlockchainInfoByKey(key, blockchainInfo) {
    return blockchainInfo.find(blockchain => blockchain.nameShort === key)
}

async function selectBlockchainFromPolicy(policy) {
    let blockchainPool;

    if (!policy.preferredBC || policy.preferredBC.length === 0) {
        blockchainPool = await BlockchainRepository.getAllBlockchains();
    } else {
        blockchainPool = await BlockchainRepository.getBlockchainsByNameShort(policy.preferredBC);
    }
    // If only one preferred Policy, use that and don't execute rest of code.
    if (blockchainPool.length === 1) {
        return blockchainPool;
    }

    if (policy.bcType !== 'indifferent') {
        // filter out all Blockchains that do not correspond with wanted bcType
        blockchainPool = blockchainPool.filter(blockchain => blockchain.type === policy.bcType);
    }

    // filter out all Blockchains that do not correspond with the tps threshold
    blockchainPool = blockchainPool.filter(blockchain => blockchain.tps >= policy.bcTps);

    // filter out all Blockchains that do not correspond with the blocktime threshold
    blockchainPool = blockchainPool.filter(blockchain => blockchain.blockTime <= policy.bcBlockTime);

    // filter out all Blockchains that do not correspond with the datasize threshold
    blockchainPool = blockchainPool.filter(blockchain => blockchain.maxTrxSize >= policy.bcDataSize);

    if (policy.bcTuringComplete === true) {
        // filter out all Blockchains that are not turingcomplete
        blockchainPool = blockchainPool.filter(blockchain => blockchain.turingComplete === true);
    }
    if (blockchainPool.length === 0) {
        const conflictError = new Error("Policy conflict detected, no blockchain with provided parameters available");
        conflictError.statusCode = 400;
        throw conflictError
    }

    return blockchainPool;

}

async function selectBlockchainForTransaction(policy, bcCosts, viableBlockchains, alreadyUsedBlockchains, index) {
    let bcKey = '';
    const viableBcCosts = {};
    let blockchainSelectionPool = viableBlockchains;

    if (policy['split']) {
        blockchainSelectionPool = viableBlockchains.filter(blockchain => !alreadyUsedBlockchains.includes(blockchain.nameShort));
        if (blockchainSelectionPool.length === 0) {
            return alreadyUsedBlockchains[index];
        }
    }

    blockchainSelectionPool.forEach((viableBlockchain) => {
        viableBcCosts[viableBlockchain.nameShort] = bcCosts[viableBlockchain.nameShort];
    });
    if (policy.costProfile === constants.costProfiles.PERFORMANCE) {
        const mostPerformantBlockchain = blockchainSelectionPool.reduce((prev, current) => {
            return prev.tps > current.tps ? prev : (prev.tps === current.tps) ? ((viableBcCosts[prev.nameShort] < viableBcCosts[current.nameShort]) ? prev : current) : current;
        });
        bcKey = mostPerformantBlockchain.nameShort;
    } else {
        bcKey = Object.keys(viableBcCosts).reduce((prev, current) => {
            return viableBcCosts[prev] < viableBcCosts[current] ? prev : (viableBcCosts[prev] === viableBcCosts[current]) ? ((getBlockchainInfoByKey(prev, blockchainSelectionPool).tps > getBlockchainInfoByKey(current, blockchainSelectionPool).tps) ? prev : current) : current;
        });
    }

    return bcKey;
}

//Rati Machine Learning Blockchain Selection
async function selectBlockchainWithMlFromPolicy(policy) {
    if (!policy.preferredBC || policy.preferredBC.length === 0) {
        //API call to selection endpoint 
        var model = policy.mlModel;
        var type = policy.bcType;
        var smart_contract = policy.bcSmartContract;
        var turing_complete = policy.bcTuringComplete;
        var popularity = policy.popularity;
        var data_size = policy.bcDataSize;
        var platformTransactionSpeed = policy.platformTransactionSpeed;


           if (type === 'public' || type === 'indifferent') {
                type = 1;
            } else  {
                type = 0;
            }

            if (turing_complete === true) {
                turing_complete = 1;
            } else {
                turing_complete = 0;
            }

            if (smart_contract) {
                smart_contract = 1;
            } else  {
                smart_contract = 0;
            }

            if (popularity === 'low') {
                popularity = 1;
            } else if (popularity === 'medium') {
                popularity = 2;
            } else {
                popularity = 3;
            }

            if (platformTransactionSpeed === 'low') {
                platformTransactionSpeed = 1;
            } else if (platformTransactionSpeed === 'medium') {
                platformTransactionSpeed = 2;
            } else {
                platformTransactionSpeed = 3;
            }


        
        var options = {
            /*uri:('http://192.168.178.20:5000/api/predict'),*/
            // ip university
            uri:('http://10.12.237.75:5000/api/predict'),
            method: 'POST',
            body: {
                "model": model,
                "type": type,
                "smart_contract": smart_contract,
                "turing_complete": turing_complete,
                "transaction_speed": platformTransactionSpeed,
                "popularity": popularity,
                "data_size": data_size,
               
            },
            headers: {
                "Content-type": "application/json"
            },
            json: true
        };

        return new Promise((resolve, reject) => {
            request(options).then((response) => {
                resolve(response);
            }).catch((err) => {
                reject(err);
            });
        })
        /*request(options)
            .then((response) => {
                console.log(response)
                return response.data;
            })
            .catch((err) => {
                console.log(err);
            });*/
        
    }
}

module.exports = {
    selectBlockchainFromPolicy,
    selectBlockchainForTransaction,
    selectBlockchainWithMlFromPolicy,
};