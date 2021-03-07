const TransactionRepository = require('../repositories/transaction-repository');
const policySelector = require('./policy-selector');
const blockchainSelector = require('./blockchain-selector');
const ratesAPI = require('../api/bc-rates');
const costCalculator = require('./cost-calculator');
const userCostUpdater = require('./user-cost-updater');
const constants = require('../constants');
const util = require('../util');
const BlockchainRepository = require('../repositories/blockchain-repository');
const fetch = require("node-fetch")
const request = require('request-promise');

/*
async function getAllBlockchainCostsPerByte(currency) {
    // TODO: Switch back to API for prod
    //const publicBlockchainsString = util.publicBlockchainsForCostRequest();
    //const publicBlockchainRates = await ratesAPI.fetchBlockchainCost(currency, publicBlockchainsString);
    const publicBlockchainRates = await ratesAPI.fetchBlockchainCostNOAPI(currency);
    const allBlockchainRates = util.addPrivateRatesToObject(publicBlockchainRates);
    return await costCalculator.calculateCosts(allBlockchainRates);
}

function getCostsForData(costsPerByte, data) {
    const costs = [];

    if (data.violations) {
        data.violations.map((sheetData) => {
            const costsForSheet = costCalculator.multiplyWithBytes(costsPerByte, sheetData.sizeString);
            costs.push(costsForSheet);
        });
        return costs;
    }

    const costsForTrxHash = costCalculator.multiplyWithBytes(costsPerByte, data.sizeString);
    costs.push(costsForTrxHash);
    return costs;

}*/

async function makeSelection(policies, user, transactionData) {
    /*const costsPerByte = await getAllBlockchainCostsPerByte(user.currency);*/
    /*let sheetCosts = getCostsForData(costsPerByte, transactionData);*/
    let currentlyActivePolicy;
    let previouslyActivePolicy;
    let viableBlockchains;
    let alreadyUsedBlockchainIndex = 0;
    const transactionInfo = [];
    let alreadyUsedBlockchains = [];
    /*for (let [index, cost] of sheetCosts.entries()) {
        currentlyActivePolicy = await policySelector.selectPolicy(policies, user);
        viableBlockchains = await blockchainSelector.selectBlockchainFromPolicy(currentlyActivePolicy);
        let chosenBlockchainKey = await blockchainSelector.selectBlockchainForTransaction(currentlyActivePolicy, cost, viableBlockchains, alreadyUsedBlockchains, alreadyUsedBlockchainIndex);
        if (currentlyActivePolicy['split']) {
            if (previouslyActivePolicy && !previouslyActivePolicy._id.equals(currentlyActivePolicy._id)) {
                alreadyUsedBlockchains = [];
                alreadyUsedBlockchainIndex = 0;
            }
            chosenBlockchainKey = await blockchainSelector.selectBlockchainForTransaction(currentlyActivePolicy, cost, viableBlockchains, alreadyUsedBlockchains, alreadyUsedBlockchainIndex);
            if (alreadyUsedBlockchainIndex >= alreadyUsedBlockchains.length - 1) {
                alreadyUsedBlockchainIndex = 0;
            } else if (alreadyUsedBlockchains.length === viableBlockchains.length) {
                alreadyUsedBlockchainIndex = alreadyUsedBlockchainIndex + 1;
            }
            if (!alreadyUsedBlockchains.includes(chosenBlockchainKey)) {
                alreadyUsedBlockchains.push(chosenBlockchainKey);
            }
        } else {
            chosenBlockchainKey = await blockchainSelector.selectBlockchainForTransaction(currentlyActivePolicy, cost, viableBlockchains, alreadyUsedBlockchains, alreadyUsedBlockchainIndex);
        }*/


    //RATI TEST
    currentlyActivePolicy = await policySelector.selectPolicy(policies, user);

    if (!currentlyActivePolicy.preferredBC || currentlyActivePolicy.preferredBC.length === 0) {
        //API call to selection endpoint 
        var type = currentlyActivePolicy.bcType;
        var smart_contract = currentlyActivePolicy.bcSmartContract;
        var turing_complete = currentlyActivePolicy.bcTuringComplete;
        var popularity = currentlyActivePolicy.popularity;
        var data_size = currentlyActivePolicy.bcDataSize


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


        function sendData() {
            var options = {
                uri:('http://192.168.178.20:5000/api/predict'),
                method: 'POST',
                body: {
                    "type": type,
                    "smart_contract": smart_contract,
                    "turing_complete": turing_complete,
                    "transaction_speed": 2,
                    "popularity": popularity,
                    "data_size": data_size,
                   
                },
                headers: {
                    "Content-type": "application/json"
                },
                json: true
            };
            request(options)
                .then((parsedBody) => {
                    console.log(parsedBody);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        sendData();

    
          
        /*fetch('http://192.168.178.20:5000/api/predict', {
            method: 'POST',
            body: {
                    "type": 1,
                    "smart_contract": 1,
                    "turing_complete": 1,
                    "transaction_speed": 2,
                    "popularity": 3,
                    "data_size": 50
            },
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                response.json()
            })
            .catch(err => {
                console.log(err)
            })*/
        
        blockchainPool = await BlockchainRepository.getAllBlockchains();



    } else {
        blockchainPool = await BlockchainRepository.getBlockchainsByNameShort(policy.preferredBC);
    }
  

    
    viableBlockchains = await blockchainSelector.selectBlockchainFromPolicy(currentlyActivePolicy);
    return viableBlockchains;
}
        /*
        await userCostUpdater.addToUserCosts(user, cost[chosenBlockchainKey]);
        const data = transactionData.violations ? transactionData.violations[index].dataString : transactionData.dataString;
        const dataHash = transactionData.violations ? transactionData.violations[index].dataHash : transactionData.dataHash;
        const transaction = {
            username: user.username,
            blockchain: constants.blockchains[chosenBlockchainKey].name,
            dataHash,
            data,
            cost: cost[chosenBlockchainKey],
            policyId: currentlyActivePolicy._id,
            costProfile: currentlyActivePolicy.costProfile,
            interval: currentlyActivePolicy.interval
        };
        await TransactionRepository.createTransaction(transaction);
        transactionInfo.push(transaction);
        previouslyActivePolicy = currentlyActivePolicy;
    }
    return transactionInfo;
}
*/
module.exports = {
    makeSelection
};