const request = require('request-promise');

module.exports.fetchBlockchainCost = (currency, blockchains) => {
    const options = {
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        qs: {
            symbol: blockchains,
            convert: currency
        },
        headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
        },
        json: true
    };
    return new Promise((resolve, reject) => {
        request(options).then((response) => {
            const cleanedResponse = {};
            Object.keys(response.data).forEach(bcKey => {
                cleanedResponse[bcKey] = response.data[bcKey].quote[currency].price;
            });
            resolve(cleanedResponse);
        }).catch((err) => {
            reject(err);
        });
    })
};

//TODO: REmove this from PRod
module.exports.fetchBlockchainCostNOAPI = (currency = 'CHF') => {
    const data = {
        "status": {
            "timestamp": "2019-05-25T11:34:49.450Z",
            "error_code": 0,
            "error_message": null,
            "elapsed": 5,
            "credit_count": 1
        },
        "data": {
            "BTC": {
                "id": 1,
                "name": "Bitcoin",
                "symbol": "BTC",
                "slug": "bitcoin",
                "circulating_supply": 17721275,
                "total_supply": 17721275,
                "max_supply": 21000000,
                "date_added": "2013-04-28T00:00:00.000Z",
                "num_market_pairs": 7553,
                "tags": [
                    "mineable"
                ],
                "platform": null,
                "cmc_rank": 1,
                "last_updated": "2019-05-25T11:34:32.000Z",
                "quote": {
                    "CHF": {
                        "price": 8120.731697811116,
                        "volume_24h": 25390214614.23328,
                        "percent_change_1h": 0.2537,
                        "percent_change_24h": 1.3681,
                        "percent_change_7d": 10.2781,
                        "market_cap": 143909719618.1277,
                        "last_updated": "2019-05-25T11:34:00.000Z"
                    },
                    "USD": {
                        "price": 8104.45931601,
                        "volume_24h": 25339448584.3204,
                        "percent_change_1h": 0.222865,
                        "percent_change_24h": 1.337,
                        "percent_change_7d": 10.2442,
                        "market_cap": 143621352265.3251,
                        "last_updated": "2019-05-25T11:35:31.000Z"
                    },
                    "EUR": {
                        "price": 7228.333319551087,
                        "volume_24h": 22594045997.25749,
                        "percent_change_1h": 0.2063,
                        "percent_change_24h": 1.2725,
                        "percent_change_7d": 10.201,
                        "market_cap": 128095282547.42769,
                        "last_updated": "2019-05-25T11:41:00.000Z"
                    }
                }
            },
            "EOS": {
                "id": 1765,
                "name": "EOS",
                "symbol": "EOS",
                "slug": "eos",
                "circulating_supply": 913050843.278,
                "total_supply": 1013050847.2539,
                "max_supply": null,
                "date_added": "2017-07-01T00:00:00.000Z",
                "num_market_pairs": 315,
                "tags": [],
                "platform": null,
                "cmc_rank": 6,
                "last_updated": "2019-05-25T11:34:03.000Z",
                "quote": {
                    "CHF": {
                        "price": 6.507771242822324,
                        "volume_24h": 2631909686.0897975,
                        "percent_change_1h": 0.225,
                        "percent_change_24h": 2.5692,
                        "percent_change_7d": 9.314,
                        "market_cap": 5941926021.119241,
                        "last_updated": "2019-05-25T11:34:00.000Z"
                    },
                    "USD": {
                        "price": 6.48963710715,
                        "volume_24h": 2610381955.70945,
                        "percent_change_1h": 0.166983,
                        "percent_change_24h": 2.43415,
                        "percent_change_7d": 9.19474,
                        "market_cap": 5925368633.251508,
                        "last_updated": "2019-05-25T11:35:06.000Z"
                    },
                    "EUR": {
                        "price": 5.782951772657116,
                        "volume_24h": 2317050339.1061044,
                        "percent_change_1h": 0.0444,
                        "percent_change_24h": 2.2454,
                        "percent_change_7d": 9.0544,
                        "market_cap": 5280144993.122965,
                        "last_updated": "2019-05-25T11:41:00.000Z"
                    }
                }
            },
            "ETH": {
                "id": 1027,
                "name": "Ethereum",
                "symbol": "ETH",
                "slug": "ethereum",
                "circulating_supply": 106213250.0616,
                "total_supply": 106213250.0616,
                "max_supply": null,
                "date_added": "2015-08-07T00:00:00.000Z",
                "num_market_pairs": 5372,
                "tags": [
                    "mineable"
                ],
                "platform": null,
                "cmc_rank": 2,
                "last_updated": "2019-05-25T11:34:23.000Z",
                "quote": {
                    "CHF": {
                        "price": 257.22830504138665,
                        "volume_24h": 9838058245.737263,
                        "percent_change_1h": 0.1449,
                        "percent_change_24h": 2.1156,
                        "percent_change_7d": 7.8645,
                        "market_cap": 27321054286.282322,
                        "last_updated": "2019-05-25T11:34:00.000Z"
                    },
                    "USD": {
                        "price": 256.881008333,
                        "volume_24h": 9815130080.63257,
                        "percent_change_1h": 0.179726,
                        "percent_change_24h": 2.15113,
                        "percent_change_7d": 7.90203,
                        "market_cap": 27284166774.148884,
                        "last_updated": "2019-05-25T11:35:22.000Z"
                    },
                    "EUR": {
                        "price": 228.79818671299,
                        "volume_24h": 8756663229.3566,
                        "percent_change_1h": 0.0217,
                        "percent_change_24h": 1.9547,
                        "percent_change_7d": 7.7234,
                        "market_cap": 24301443634.63386,
                        "last_updated": "2019-05-25T11:41:00.000Z"
                    }
                }
            },
            "MIOTA": {
                "id": 1720,
                "name": "IOTA",
                "symbol": "MIOTA",
                "slug": "iota",
                "circulating_supply": 2779530283,
                "total_supply": 2779530283,
                "max_supply": 2779530283,
                "date_added": "2017-06-13T00:00:00.000Z",
                "num_market_pairs": 41,
                "tags": [],
                "platform": null,
                "cmc_rank": 15,
                "last_updated": "2019-05-25T11:34:02.000Z",
                "quote": {
                    "CHF": {
                        "price": 0.3937592238256026,
                        "volume_24h": 32781929.68745386,
                        "percent_change_1h": 0.8207,
                        "percent_change_24h": -0.6154,
                        "percent_change_7d": 1.1783,
                        "market_cap": 1094465686.8338375,
                        "last_updated": "2019-05-25T11:34:00.000Z"
                    },
                    "USD": {
                        "price": 0.393236031941,
                        "volume_24h": 32710378.0698828,
                        "percent_change_1h": 0.83782,
                        "percent_change_24h": -0.545298,
                        "percent_change_7d": 1.23756,
                        "market_cap": 1093011459.1467648,
                        "last_updated": "2019-05-25T11:35:04.000Z"
                    },
                    "EUR": {
                        "price": 0.35089228196793343,
                        "volume_24h": 29132226.135927767,
                        "percent_change_1h": 0.6928,
                        "percent_change_24h": -0.5116,
                        "percent_change_7d": 1.2669,
                        "market_cap": 975315723.8008459,
                        "last_updated": "2019-05-25T11:41:00.000Z"
                    }
                }
            },
            "XLM": {
                "id": 512,
                "name": "Stellar",
                "symbol": "XLM",
                "slug": "stellar",
                "circulating_supply": 19298944622.8349,
                "total_supply": 105002442920.353,
                "max_supply": null,
                "date_added": "2014-08-05T00:00:00.000Z",
                "num_market_pairs": 266,
                "tags": [],
                "platform": null,
                "cmc_rank": 9,
                "last_updated": "2019-05-25T11:34:03.000Z",
                "quote": {
                    "CHF": {
                        "price": 0.12840436111106518,
                        "volume_24h": 390419986.82539535,
                        "percent_change_1h": 0.5343,
                        "percent_change_24h": 0.5949,
                        "percent_change_7d": -2.0211,
                        "market_cap": 2478068654.4129424,
                        "last_updated": "2019-05-25T11:34:00.000Z"
                    },
                    "USD": {
                        "price": 0.128163821857,
                        "volume_24h": 389700143.846476,
                        "percent_change_1h": 0.516524,
                        "percent_change_24h": 0.577192,
                        "percent_change_7d": -2.03842,
                        "market_cap": 2473426500.6691203,
                        "last_updated": "2019-05-25T11:35:04.000Z"
                    },
                    "EUR": {
                        "price": 0.11430249733448743,
                        "volume_24h": 346431058.12988216,
                        "percent_change_1h": 0.4691,
                        "percent_change_24h": 0.4749,
                        "percent_change_7d": -2.0859,
                        "market_cap": 2205917566.3100066,
                        "last_updated": "2019-05-25T11:41:00.000Z"
                    }
                }
            }
        }
    };
    const cleanedData = {};
    Object.keys(data.data).forEach(bcKey => {
        cleanedData[bcKey] = data.data[bcKey].quote[currency].price;
    });
    return cleanedData
};