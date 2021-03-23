const blockchainTypes = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    BOTH: 'both',
};

const intervals = {
    DEFAULT: 'default',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
};

const costProfiles = {
    ECONOMIC: 'economic',
    PERFORMANCE: 'performance'
};

const blockchains = {
    BTC: {
        name: 'Bitcoin',
        nameShort: 'BTC',
        type: blockchainTypes.PUBLIC
    },
    ETH: {
        name: 'Ethereum',
        nameShort: 'ETH',
        type: blockchainTypes.PUBLIC
    },
    XLM: {
        name: 'Stellar',
        nameShort: 'XLM',
        type: blockchainTypes.PUBLIC
    },
    EOS: {
        name: 'EOS',
        nameShort: 'EOS',
        type: blockchainTypes.PUBLIC
    },
    MIOTA: {
        name: 'IOTA',
        nameShort: 'MIOTA',
        type: blockchainTypes.PUBLIC
    },
    HYP: {
        name: 'Hyperledger',
        nameShort: 'HYP',
        type: blockchainTypes.PRIVATE
    },
    MLC: {
        name: 'Multichain',
        nameShort: 'MLC',
        type: blockchainTypes.PRIVATE
    },
    PSG: {
        name: 'Postgres',
        nameShort: 'PSG',
        type: blockchainTypes.PRIVATE
    },
    NEO: {
        name: 'Neo',
        nameShort: 'NEO',
        type: blockchainTypes.PUBLIC
    },
    STRAX: {
        name: 'Stratis',
        nameShort: 'STRAX',
        type: blockchainTypes.PRIVATE
    },
    COR: {
        name: 'R3 Corda',
        nameShort: 'COR',
        type: blockchainTypes.PRIVATE
    },
    ADA: {
        name: 'Cardano',
        nameShort: 'ADA',
        type: blockchainTypes.PUBLIC
    },
    XRP: {
        name: 'Ripple',
        nameShort: 'XRP',
        type: blockchainTypes.PUBLIC
    },
    QTUM: {
        name: 'QTUM',
        nameShort: 'QTUM',
        type: blockchainTypes.PUBLIC
    },
    ICX: {
        name: 'ICON',
        nameShort: 'ICX',
        type: blockchainTypes.PUBLIC
    },
    VET: {
        name: 'VeChain',
        nameShort: 'VET',
        type: blockchainTypes.PUBLIC
    },
    WAN: {
        name: 'Wanchain',
        nameShort: 'WAN',
        type: blockchainTypes.PUBLIC
    },

};

const exchanges = {
    WEI_TO_ETH: 1000000000000000000,
    GWEI_TO_ETH: 1000000000,
    SATOSHIS_TO_BTC: 100000000,
    BYTE_TO_KBYTE: 1024,
    GAS_PER_BYTE: 625,
};

const baseTransactionCost = 0.01;

module.exports = {
    blockchainTypes,
    intervals,
    costProfiles,
    blockchains,
    exchanges,
    baseTransactionCost,
};