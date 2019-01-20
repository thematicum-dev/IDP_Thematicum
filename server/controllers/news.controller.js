import RealtimeNews from '../models/news'
import DataRepository from '../data_access/dataRepository'
import {AppError} from "../utilities/appError";
import {AppResponse} from "../utilities/appResponse";

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

const repo = new DataRepository();

export function getRealtimeNews(req, res, next) {

    let query = '';

    if (req.theme.tags.length >= 1) {
        query = req.theme.tags[0];
        for (let i = 1; i < req.theme.tags.length; i++) {
            query = query + ' OR ' + req.theme.tags[i];
        }
        query = req.theme.name + ' AND (' + query + ')';
    } else {
        query = req.theme.name;
    }

    getNews(query, 'publishedAt', req.theme._id)
        .then((newsCollection) => {
            if (newsCollection.length === 0) {
                console.log("No news received from API. Sending second request.");
                getNews(req.theme.name, 'publishedAt', req.theme._id)
                    .then((newResults) => {
                        if (newResults.length > 0) {
                            return saveCollection(newResults);
                        } else {
                            return new Promise.resolve();
                        }
                    })
            } else {
                return saveCollection(newsCollection);
            }

        })
        .then(() => repo.getNewsByThemeIdFor6Months(req.theme._id))
        .then((allNews) => {

            allNews.sort(compareByDate);

            repo.getUserVotedNews(res.locals.user._id)
                .then((userVotedNews) => {

                    for (let i = 0, len = allNews.length; i < len; i++) {
                        allNews[i].userUpVoted = false;
                        allNews[i].userDownVoted = false;
                        for (let k = 0, len2 = userVotedNews.length; k < len2; k++) {
                            if (userVotedNews[k].upvoted === true && allNews[i]._id.equals(userVotedNews[k].news)) {
                                allNews[i].userUpVoted = true;
                            }
                            if (userVotedNews[k].downvoted === true && allNews[i]._id.equals(userVotedNews[k].news)) {
                                allNews[i].userDownVoted = true;
                            }
                        }
                    }
                    return res.status(200).json(new AppResponse('News fetched.', allNews));
                })
                .catch(() => {
                    return res.status(200).json(new AppResponse('News fetched.', allNews));
                });
        })
        .catch((err) => {
            console.log(err);
            return res.status(404).json(new AppError('No news found.', ':/'));
        });
}






export function getRelevantNews(req, res, next) {


    let query = '';

    if (req.theme.tags.length >= 1) {
        query = req.theme.tags[0];
        for (let i = 1; i < req.theme.tags.length; i++) {
            query = query + ' OR ' + req.theme.tags[i];
        }
        query = req.theme.name + ' AND (' + query + ')';
    } else {
        query = req.theme.name;
    }

    let news = [];

    getNews(query, 'relevancy', req.theme._id)
        .then((newsCollection) => {
            if (newsCollection.length === 0) {
                console.log("No news received from API. Sending second request.");
                getNews(req.theme.name, 'publishedAt', req.theme._id)
                    .then((newResults) => {
                        if (newResults.length > 0) {
                            news = newResults;
                            return saveCollection(newResults);
                        } else {
                            return new Promise.resolve();
                        }
                    })
            } else {
                news = newsCollection;
                return saveCollection(newsCollection);
            }

        })
        .then(() => {
            let allNews = [];
            Promise.all(news.map((entry) => repo.getNewsWith0VoteByUrl(entry.url)))
                .then((r) => {

                    for (let i=0; i<r.length; i++) {
                        if (r[i].length !== 0) {
                            allNews.push(r[i][0]);
                        }
                    }

                    repo.getVotedNewsByThemeId(req.theme._id)
                        .then((allVotedNews) => {


                            // use only 10% of news from the db
                            let subsetVotedNews = [];
                            allVotedNews.sort(compareByRelevancy);
                            for (let j=0; j < allVotedNews.length/10.0; j++) {
                                subsetVotedNews.push(allVotedNews[j]);
                            }

                            allNews = allNews.concat(subsetVotedNews);
                            console.log(allNews.length);
                            // console.log(allNews);
                            allNews.sort(compareByRelevancy);

                            repo.getUserVotedNews(res.locals.user._id)
                                .then((userVotedNews) => {
                                    for (let i = 0, len = allNews.length; i < len; i++) {
                                        allNews[i].userUpVoted = false;
                                        allNews[i].userDownVoted = false;
                                        for (let k = 0, len2 = userVotedNews.length; k < len2; k++) {
                                            if (userVotedNews[k].upvoted === true && allNews[i]._id.equals(userVotedNews[k].news)) {
                                                allNews[i].userUpVoted = true;
                                            }
                                            if (userVotedNews[k].downvoted === true && allNews[i]._id.equals(userVotedNews[k].news)) {
                                                allNews[i].userDownVoted = true;
                                            }
                                        }
                                    }
                                    return res.status(200).json(new AppResponse('News fetched.', allNews));
                                })
                                .catch(() => {
                                    return res.status(200).json(new AppResponse('News fetched.', allNews));
                                });

                        })
                        .catch(() => {
                            return res.status(404).json(new AppError('No news found.', ':/'));
                        });
                });
        })
        .catch((err) => {
            console.log(err);
            return res.status(404).json(new AppError('No news found.', ':/'));
        });

}

function getNews(query, sortBy, themeId) {

    return new Promise((resolve, reject) => {
        newsapi.v2.everything({
            q: query,
            language: 'en',
            sortBy: sortBy,
            page: 1
        }).then(response => {

            if (response.status !== "ok") {
                // return res.status(404).json(new AppError('No news found.', response.message));
                resolve([]);
            }

            let newsCollection = [];
            for (let i=0; i<response.articles.length; i++) {
                let news = new RealtimeNews({
                    title: response.articles[i].title,
                    description: response.articles[i].description,
                    source: response.articles[i].source.name,
                    author: response.articles[i].author,
                    url: response.articles[i].url,
                    urlToImage: response.articles[i].urlToImage,
                    publishedAt: response.articles[i].publishedAt,
                    content: response.articles[i].content,
                    themeId: themeId
                });

                let duplicate = false;
                newsCollection.every(function (entry) {
                    if (entry.title.toLowerCase() === news.title.toLowerCase()) {
                        duplicate = true;
                        return false;
                    } else {
                        return true;
                    }
                });
                if (!duplicate) {
                    newsCollection.push(news);
                }
            }

            resolve(newsCollection);

        })
    })
}


function saveCollection(collection) {
    return new Promise((resolve, reject) => {
        RealtimeNews.collection.insert(collection, { ordered: false }, () => {
            resolve();
        });
    })
}

export function performNewsUpVote(req, res, next) {
    repo.toggleUserUpVoteForNews(res.locals.user._id, req.news._id)
        .then(() => {
            // return res.status(200).json(allNews);
            return res.status(200).json(new AppResponse('Updated.'));
        })
        .catch(() => {
            return res.status(404).json(new AppError('Update failed.', ':/'));
        });
}

export function performNewsDownVote(req, res, next) {
    repo.toggleUserDownVoteForNews(res.locals.user._id, req.news._id)
        .then(() => {
            // return res.status(200).json(allNews);
            return res.status(200).json(new AppResponse('Updated.'));
        })
        .catch(() => {
            return res.status(404).json(new AppError('Update failed.', ':/'));
        });
}

export function newsById(req, res, next, id) {
    repo.getNewsById(id)
        .then(result => {
            if (!result) {

                return next(new AppError('No news found for the given Id', 404))
            }

            req.news = result;
            // req.isCurrentUserCreator = isCurrentUserThemeCreator(result, res);
            next();
        })
        .catch(err => {
            next(err);
        });
}

function compareByDate(a,b) {
    if (a.publishedAt > b.publishedAt)
        return -1;
    if (a.publishedAt < b.publishedAt)
        return 1;
    return 0;
}

function compareByRelevancy(a,b) {
    if (a.relevancyRanking > b.relevancyRanking)
        return -1;
    if (a.relevancyRanking < b.relevancyRanking)
        return 1;
    if (a.relevancyRanking === b.relevancyRanking)
        return compareByDate(a,b);
    return 0;
}