import CustomSearch from "../models/pdfReport";
import {AppError} from "../utilities/appError";
import DataRepository from "../data_access/dataRepository";
import {AppResponse} from "../utilities/appResponse";


const {google} = require('googleapis');
const customsearch = google.customsearch('v1');
const repo = new DataRepository();
var natural = require('natural');
const crawler = require('crawler-request');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

export function getCustomSearchResults(req, res,next) {


    repo.getAllThemes()
        // .then((themes) => getReports(themes[0]))
        .then((themes) => Promise.all(themes.map((theme) => getReports(theme))))
        // .then((themes) => themes.reduce((previous, current) => previous.then(getReports(current)), Promise.resolve()))
        .then((rankings) => console.log(rankings))
        .then(() => res.status(200).json(new AppResponse('done')))
        .catch((err) => {
            console.log(err);
            res.status(200).json(new AppResponse('done with error.'));
        })

}


export function updateReports() {
    repo.getAllThemes()
    // .then((themes) => getReports(themes[0]))
        .then((themes) => Promise.all(themes.map((theme) => getReports(theme))))
        // .then((themes) => themes.reduce((previous, current) => previous.then(getReports(current)), Promise.resolve()))
        .then((rankings) => console.log('BASHI :' + rankings))
        .then(() => res.status(200).json(new AppResponse('done')))
        .catch((err) => {
            console.log(err);
        })
}

function getReports(theme) {

    return new Promise((resolve, reject) => {
        let orTerms = '';
        if (theme.tags.length >= 1) {
            orTerms = theme.tags[0];

            for (let i = 1; i < theme.tags.length; i++) {
                orTerms = orTerms + ', ' + theme.tags[i];
            }
        }

        customsearch.cse.list({
            cx: process.env.GOOGLE_CUSTOM_SEARCH_CX,
            q: theme.name,
            auth: process.env.GOOGLE_CUSTOM_SEARCH_AUTH,
            fileType: 'pdf',
            orTerms: orTerms
        })
            .then((result) => {

                let reportsCollection = [];

                for (let i=0; i<result.data.items.length; i++) {
                    // console.log(result.data.items[i].pagemap);
                    let report = new CustomSearch({
                        title: result.data.items[i].title,
                        snippet: result.data.items[i].snippet,
                        link: result.data.items[i].link,
                        displayLink: result.data.items[i].displayLink,
                        themeId: theme._id
                    });
                    reportsCollection.push(report);
                }

                CustomSearch.collection.insert(reportsCollection, { ordered: false }, (err, result) => {
                    // resolve(theme._id);
                    repo.getReportsByThemeId(theme._id)
                        .then((reports) => getRanking(reports, theme.tags))
                        .then((rankings) => rankings.map((ranking) => repo.setTFIDFReportRanking(ranking)))
                        .then((results) => resolve(results))
                        .catch((err) => {
                            console.log(err);
                            resolve('');
                        })
                });
            })
            .catch((err) => {
                console.log(err);
                resolve('')
            });
    });
}


export function getRanking(reportsSet, tags) {

    var TfIdf = natural.TfIdf;
    var tfidf = new TfIdf();

    // let urls = reportsSet.map(report => report['link']);

    let terms = '';
    for (let i = 0; i < tags.length; i++) {
        terms = terms + tags[i];
    }

    return new Promise((resolve, reject) => {
        Promise.all(reportsSet.map((report) => getDocument(report)))
            .then((docs) =>{

                let filteredDocs = docs.filter(function (entry) {
                    return entry !== '';
                });

                for (let i = 0; i < filteredDocs.length; i ++) {
                    tfidf.addDocument(filteredDocs[i]['doc']);
                }

                console.log('docs length: ' + docs.length + '; filtered docs length: ' + filteredDocs.length);

                let denominator = 1;
                let maxMeasure = 0;
                tfidf.tfidfs(terms, function(i, measure) {
                    if (measure > maxMeasure) {
                        maxMeasure = measure;
                    }
                });
                if (maxMeasure > 0) {
                    denominator = maxMeasure/100.0;
                }

                let results = [];
                tfidf.tfidfs(terms, function(i, measure) {
                    let result = {};
                    result['id'] = filteredDocs[i]['id'];
                    result['measure'] = measure/denominator;
                    results.push(result);
                    console.log('document #' + filteredDocs[i]['id'] + ' is ' + measure);
                });

                resolve(results);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });

}

function getDocument(report) {
    return new Promise((resolve, reject) =>{

        console.log('sending request to '+ report['link']);
        crawler(report['link'])
            .then(function(response){
                console.log('got response from ' + report['link']);
                if (response.status === 200) {
                    let result = {};
                    result['doc'] = response.text;
                    result['id'] = report._id;
                    resolve(result);
                } else {
                    console.log(response);
                    resolve('');
                }
            })
            .catch( (err) => {
                console.log(err);
                resolve('');
            });

        setTimeoutPromise(60000).then(() => {
            // value === 'foobar' (passing values is optional)
            // This is executed after about 40 milliseconds.
            resolve('');
        });

    });
}