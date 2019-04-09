import {AppResponse} from "../utilities/appResponse";
import DataRepository from "../data_access/dataRepository";


const repo = new DataRepository();


let urlExists = require('url-exists-deep');


export function removeObsoleteURLs(req, res, next) {

    repo.getAllReports()
        .then((reports) => {

            if (reports.length > 0) {
                var promise = checkReport(reports[0]);
                for (var i = 1; i < reports.length; i++)
                    promise = promise.then(checkReport(reports[i]));
            }

            promise.then(repo.getAllNews()
                .then((news) => {
                    if (news.length > 0) {
                        var promise2 = checkNews(news[0]);
                        for (var j = 1; j < news.length; j++)
                            promise2 = promise2.then(checkNews(news[j]));
                    }
                }));
        });


        // .then((reports) => reports.reduce((previous, current) => previous.then(checkReport(current)), Promise.resolve()))
        // .then(() => repo.getAllNews())
        // .then((news) => news.reduce((previous, current) => previous.then(checkNews(current)), Promise.resolve()));

    return res.status(200).json(new AppResponse("OK"));
}

function checkNews(news) {
    return new Promise((resolve, reject) => {
            urlExists(news['url'], undefined, 'GET', 30000)
            .then(function(response){
                if (response) {
                    console.log("Url exists", response.href);
                } else {
                    console.log("Url does not exist!", response.href);
                    console.log(news['url']);
                    repo.removeNewsById(news['_id']);
                }
                resolve();
            })
            .catch((err) => {
                console.log(err);
                resolve();
            });

    });

}

function checkReport(report) {
    return new Promise((resolve, reject) => {
        let d = new Date();
        d.setMonth(d.getMonth() - 12);

        // check if DB entry was created more than 12 months ago
        if (report['_id'].getTimestamp() < d) {
            repo.removeReportById(report['_id']);
        } else {
            urlExists(report['link'], undefined, 'GET', 30000)
                .then(function(response){
                    if (response) {
                        console.log("Url exists", response.href);
                        resolve();
                    } else {
                        console.log("Url does not exist!");
                        console.log(response);
                        repo.removeReportById(report['_id']);
                        resolve();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    resolve();
                })
        }
    });

}



export function removeObsoleteURLsFromDB() {

    repo.getAllReports()
        .then((reports) => {

            let d = new Date();
            d.setMonth(d.getMonth() - 12);

            for (let i=0; i<reports.length; i++) {
                // check if DB entry was created more than 12 months ago
                if (reports[i]['_id'].getTimestamp() < d) {
                    repo.removeReportById(reports[i]['_id']);
                } else {
                    urlExists(reports[i]['link'], undefined, 'GET', 300000)
                        .then(function(response){
                            if (response) {
                                console.log("Url exists", response.href);
                            } else {
                                console.log("Url does not exists!");
                                console.log(response);
                                repo.removeReportById(reports[i]['_id']);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
            }
        });

    repo.getAllNews()
        .then((news) => {
            for (let i=0; i<news.length; i++) {
                urlExists(news[i]['url'], undefined, 'GET', 300000)
                    .then(function(response){
                        if (response) {
                            console.log("Url exists", response.href);
                        } else {
                            console.log("Url does not exists!", response.href);
                            console.log(news[i]['url']);
                            repo.removeNewsById(news[i]['_id']);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        });
}
