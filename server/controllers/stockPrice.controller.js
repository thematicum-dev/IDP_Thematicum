import DataRepository from "../data_access/dataRepository";

const axios = require('axios');
const repo = new DataRepository();


export function stockPrice(results) {

    return new Promise((resolve, reject) => {
        Promise.all(results.map(entry => repo.getStockById(entry.stock._id)))
            .then(stockEntries => Promise.all(stockEntries.map(entry => attachDayPrice(entry._id, entry.ticker))))
            .then(stockPrices => {
                // console.log(stockPrices);

                var newResults = [];

                results.forEach(function(resultItem) {
                    const newThemeItem = {};
                    newThemeItem['_id'] = resultItem._id;
                    newThemeItem['updatedAt'] = resultItem['updatedAt'];
                    newThemeItem['addedAt'] = resultItem['addedAt'];
                    newThemeItem['theme'] = resultItem['theme'];
                    newThemeItem['addedBy'] = resultItem['addedBy'];
                    newThemeItem['__v'] = resultItem['__v'];
                    newThemeItem['isValidated'] = resultItem['isValidated'];
                    newThemeItem['stock'] = {};
                    newThemeItem['stock']['_id'] = resultItem['stock']['_id'];
                    newThemeItem['stock']['companyName'] = resultItem['stock']['companyName'];
                    newThemeItem['stock']['country'] = resultItem['stock']['country'];
                    stockPrices.forEach(function (price) {
                        if (price.hasOwnProperty(resultItem['stock']['_id'])) {
                            newThemeItem['stock']['dayClosePriceChangePercentage'] = price[resultItem['stock']['_id']]['dailyPriceChangePercentage'];
                            newThemeItem['stock']['monthlyChangePercentage'] = price[resultItem['stock']['_id']]['monthlyChangePercentage'];
                        }
                    });
                    newResults.push(newThemeItem);
                });

                resolve(newResults);
            })
            .catch((err) => {
                console.log(err);
                resolve(results)
            });

    });

}

function attachDayPrice(id, ticker) {

    let endpoint = 'https://api.iextrading.com/1.0/stock/' + ticker + '/chart/3m';
    // console.log(endpoint);

    return new Promise((resolve, reject) => {
        axios.request({url: endpoint, method: 'get', responseType: 'json'})
            .then(response => {

                // find daily price change percentage
                let date = new Date();
                let found = false;
                for (let i=0; i<10; i++) {
                    let formattedDate = date.toISOString().replace(/T.+/, '');

                    for (let k=response.data.length-1; k >= 0; k--) {
                        // console.log(response.data[k]);
                        if (response.data[k]['date'] === formattedDate) {
                            var dayClosePricePercentage = response.data[k]['changePercent'];
                            var dayClosePrice = response.data[k]['close'];
                            found = true;
                            break;
                        }
                    }
                    if (found){
                        break;
                    } else {
                        date.setDate(date.getDate() - 1);
                    }
                }

                // find monthly price change percentage
                date.setDate(date.getDate() - 30);
                found = false;
                for (let i=0; i<10; i++) {
                    let formattedDate = date.toISOString().replace(/T.+/, '');

                    for (let k=response.data.length-1; k >= 0; k--) {
                        // console.log(response.data[k]);
                        if (response.data[k]['date'] === formattedDate) {
                            var monthAgoClosePrice = response.data[k]['close'];
                            var monthlyChangePercentage = (dayClosePrice - monthAgoClosePrice) * 100.0 / monthAgoClosePrice;
                            found = true;
                            break;
                        }
                    }
                    if (found){
                        // console.log(formattedDate);
                        // console.log(monthAgoClosePrice);
                        // console.log(monthlyChangePercentage);
                        break;
                    } else {
                        date.setDate(date.getDate() - 1);
                    }
                }

                let result = {};
                let resultContents = [];
                resultContents['dailyPriceChangePercentage'] = dayClosePricePercentage;
                resultContents['monthlyChangePercentage'] = monthlyChangePercentage;
                result[id] = resultContents;
                // console.log(result);
                resolve(result);
            })
            .catch(err => {
                console.log(err);
                resolve('');
            })
    });
}