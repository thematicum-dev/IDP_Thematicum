import DataRepository from '../data_access/dataRepository'
import {AppResponse} from "../utilities/appResponse";
import {AppError} from "../utilities/appError";

const repo = new DataRepository();
const crawler = require('crawler-request');
var natural = require('natural');
const axios = require('axios');

export function getCustomSearchResults(req, res, next) {

    // console.log("IN CUSTOM SEARCH");
    // console.log(repo.getReportsByThemeId(req.params.theme));
    repo.getReportsByThemeId(req.params.theme).then(response => {

        response.sort(compareByRelevancy);

        repo.getUserVotedReports(res.locals.user._id)
            .then((userVotedReports) => {
                for (let i = 0, len = response.length; i < len; i++) {
                    response[i].userVoted = false;

                    for (let k = 0, len2 = userVotedReports.length; k < len2; k++) {
                        if (response[i]._id.equals(userVotedReports[k].report)) {
                            response[i].userVoted = true;
                        }
                    }
                }
                return res.status(200).json(new AppResponse('News fetched.', response));
            })
            .catch(() => {
                return res.status(200).json(new AppResponse('News fetched.', response));
            });

        // return res.status(200).json(new AppResponse('News fetched.', response));
    }).catch(err => {
        return res.status(404).json(new AppError('No news found.', ':/'));
    });
}



export function markReportAsRelevant(req, res, next) {
    repo.toggleUserRelevancyVoteForReport(res.locals.user._id, req.news._id)
        .then(() => {
            // return res.status(200).json(allNews);
            return res.status(200).json(new AppResponse('Updated.'));
        })
        .catch(() => {
            return res.status(404).json(new AppError('Update failed.', ':/'));
        });
}

export function reportById(req, res, next, id) {
    repo.getReportById(id)
        .then(result => {
            if (!result) {

                return next(new AppError('No report found for the given Id', 404))
            }
            req.news = result;
            next();
        })
        .catch(err => {
            next(err);
        });
}


export function getRanking(req, res, next) {

    console.log('Getting rankings ..');

    var TfIdf = natural.TfIdf;
    var tfidf = new TfIdf();

    let urls = [
        "http://www.hse.gov.uk/foi/internalops/og/og-0086.pdf",
        "https://www.renesas.com/eu/en/img/misc/catalogs/r30ca0162ej0200-industry.pdf",
        "https://literature.rockwellautomation.com/idc/groups/literature/documents/in/1770-in041_-en-p.pdf"
    ];

    Promise.all(urls.map((url) => getDocument(url)))
        .then((docs) =>{
            console.log(docs);
            for (let i = 0; i < docs.length; i ++) {
                if (docs[i] !== '') {
                    tfidf.addDocument(docs[i].toLowerCase());
                }

            }

            console.log('industrial automation --------------------------------');
            tfidf.tfidfs('industrial automation', function(i, measure) {
                console.log('document #' + i + ' is ' + measure);
            });

            return res.status(200).json(new AppResponse('OK', {

            }));
        })
        .catch((err) => console.log(err));


}

function getDocument(url) {
    return new Promise((resolve, reject) =>{

        // axios.request({url: url, method: 'GET', responseType: 'blob'})
        //     .then((response) => {
        //     console.log(response.data);
        //     const content = response.headers['content-type'];
        //     download(response.data, file.file_name, content);
        //
        //
        //     resolve(response.data);
        //     });


        console.log('sending request to '+ url);
        crawler(url)
            .then(function(response){
                console.log('got response from ' + url);
                // handle response
                // console.log(response.text.split('.').length);
                // console.log((response.text.toLowerCase().match(/industrial automation/g) || []).length);
                // console.log((response.text.toLowerCase().match(/automation/g) || []).length);
                // console.log((response.text.toLowerCase().match(/artificial intelligence/g) || []).length);
                if (response.status === 200) {
                    resolve(response.text)
                } else {
                    resolve('');
                }
            })
            .catch( (err) => {
                console.log(err);
                resolve('');
            });

    });
}


function compareByRelevancy(a,b) {
    if (a.tfidfRanking + a.relevancyRanking > b.tfidfRanking + b.relevancyRanking)
        return -1;
    if (a.tfidfRanking + a.relevancyRanking < b.tfidfRanking + b.relevancyRanking)
        return 1;
    return 0;
}