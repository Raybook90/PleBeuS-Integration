const {WEI_TO_ETH, GWEI_TO_ETH, SATOSHIS_TO_BTC, BYTE_TO_KBYTE} = require('../constants').exchanges;

function weiToGwei(wei) {
    return wei * WEI_TO_ETH;
}

function gweiToETH(gwei) {
    return gwei / GWEI_TO_ETH
}

function weiToEth(wei) {
    return wei / WEI_TO_ETH
}

function ethToWei(eth) {
    return eth * WEI_TO_ETH
}

function satoshisPerByteToBtcPerByte(sat) {
    return sat / SATOSHIS_TO_BTC
}

function satoshisPerKbToBtcperByte(sat) {
    return sat / SATOSHIS_TO_BTC / BYTE_TO_KBYTE
}

function avgCost(costOne, costTwo) {
    return {
        high: (costOne.high + costTwo.high) / 2,
        medium: (costOne.medium + costTwo.medium) / 2,
        low: (costOne.low + costTwo.low) / 2
    };
}

module.exports = {
    weiToGwei,
    gweiToETH,
    weiToEth,
    ethToWei,
    satoshisPerByteToBtcPerByte,
    satoshisPerKbToBtcperByte,
    avgCost
};