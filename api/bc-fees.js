const request = require('request-promise');
const transformUtils = require('../util/unit-transformations');

module.exports.fetchBTCFeesInBTCPerByteBCFees = () => {
    const options = {
        uri: 'https://bitcoinfees.earn.com/api/v1/fees/recommended',
        json: true
    };
    return new Promise((resolve, reject) => {
        request(options).then((response) => {
            resolve({
                high: transformUtils.satoshisPerByteToBtcPerByte(response.fastestFee),
                medium: transformUtils.satoshisPerByteToBtcPerByte(response.halfHourFee),
                low: transformUtils.satoshisPerByteToBtcPerByte(response.hourFee),
            });
        }).catch((err) => {
            reject(err);
        });
    })
};

//This API returns data per kbyte, hence the transformation
module.exports.fetchBTCFeesInBTCPerByteBlockCypher = () => {
    const options = {
        uri: 'https://api.blockcypher.com/v1/btc/main',
        json: true
    };
    return new Promise((resolve, reject) => {
        request(options).then((response) => {
            resolve({
                high: transformUtils.satoshisPerKbToBtcperByte(response.high_fee_per_kb),
                medium: transformUtils.satoshisPerKbToBtcperByte(response.medium_fee_per_kb),
                low: transformUtils.satoshisPerKbToBtcperByte(response.low_fee_per_kb),
            });
        }).catch((err) => {
            reject(err);
        });
    })
};

module.exports.fetchETHFeesPerGasEtherchain = () => {
    const options = {
        uri: 'https://www.etherchain.org/api/gasPriceOracle',
        json: true,
        // This header is needed since the api has a cloudflare protection for some reason.
        headers: {
            'User-Agent': 'PostmanRuntime/7.11.0'
        }
    };
    return new Promise((resolve, reject) => {
        request(options).then((response) => {
            resolve({
                high: transformUtils.gweiToETH(parseFloat(response.safeLow)),
                medium: transformUtils.gweiToETH(parseFloat(response.standard)),
                low: transformUtils.gweiToETH(parseFloat(response.fastest)),
            });
        }).catch((err) => {
            reject(err);
        });
    })
};

module.exports.fetchETHFeesPerGasBlockCypher = () => {
    const options = {
        uri: 'https://api.blockcypher.com/v1/eth/main',
        json: true
    };
    return new Promise((resolve, reject) => {
        request(options).then((response) => {
            resolve({
                high: transformUtils.weiToEth(response.high_gas_price),
                medium: transformUtils.weiToEth(response.medium_gas_price),
                low: transformUtils.weiToEth(response.low_gas_price),
            });
        }).catch((err) => {
            reject(err);
        });
    })
};

module.exports.fetchRAMPriceInEOS = () => {
    const options = {
        uri: 'http://mainnet.eoscanada.com/v1/chain/get_table_rows',
        method: 'POST',
        body: {
            scope: "eosio",
            code: "eosio",
            table: "rammarket",
            json: true
        },
        json: true
    };
    return new Promise((resolve, reject) => {
        request(options).then((response) => {
            // calculation of ram price according to bancor's formula
            const data = response.rows[0];
            const ramBalance = parseFloat(data['quote']['balance'].slice(0, -4));
            const eosBalance = parseFloat(data['base']['balance'].slice(0, -4));
            const price = ramBalance / eosBalance;
            resolve(price);
        }).catch((err) => {
            reject(err);
        });
    })
};