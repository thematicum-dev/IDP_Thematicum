import Stock from '../models/stock';
import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';

const repo = new DataRepository();

export function list(req, res, next) {
    repo.getAll(Stock)
        .then(results => {
            if(!results) {
                return next(new AppError('No stocks found', 404));
            }

            return res.status(200).json(new AppResponse('Stocks retrieved', results));
        })
        .catch(err => next(err));
}

export function create(req, res, next){
    repo.nextStockSeqNr().then(function(seqNr){
        const stock = new Stock({
            seqNr: seqNr,
            companyName: req.body.name.toUpperCase(),
            country: req.body.country.toUpperCase(),
            website: req.body.website.toLowerCase(),
            addedBy: res.locals.user,
            investableInstrument: req.body.investableInstrument,
        });
    
        repo.save(stock)
            .then(() => res.status(201).json(new AppResponse('Stock added', stock)))
            .catch(err => next(err)); 
    });    
}