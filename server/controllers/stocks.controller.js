import Stock from '../models/stock';
import { AppError } from '../utilities/appError';
import { AppResponse } from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';

const repo = new DataRepository();

export function list(req, res, next) {
    repo.getAll(Stock)
        .then(results => {
            if (!results) {
                return next(new AppError('No stocks found', 404));
            }

            return res.status(200).json(new AppResponse('Stocks retrieved', results));
        })
        .catch(err => next(err));
}

export function create(req, res, next) {
    repo.nextStockSeqNr().then(function (seqNr) {
        const stock = new Stock({
            seqNr: seqNr,
            companyName: req.body.name.toUpperCase(),
            country: req.body.country.toUpperCase(),
            website: req.body.website.toLowerCase(),
            addedBy: res.locals.user,
            investableInstrument: req.body.investableInstrument,
            businessDescription: req.body.businessDescription
        });

        repo.save(stock)
            .then(() => res.status(201).json(new AppResponse('Stock added', stock)))
            .catch(err => next(err));
    });
}

export function update(req, res, next) {
    let isCurrentLoggedInUserAdmin = res.locals.user.isAdmin == true ? true : false;
    if (isCurrentLoggedInUserAdmin) {
        const stock = new Stock({
            _id: req.body._id,
            companyName: req.body.name.toUpperCase(),
            country: req.body.country.toUpperCase(),
            website: req.body.website.toLowerCase(),
            addedBy: res.locals.user,
            investableInstrument: req.body.investableInstrument,
            businessDescription: req.body.businessDescription
        });
        repo.update(Stock, { "_id": stock._id }, stock)
            .then(() => res.status(201).json(new AppResponse("Stock Updated", stock)))
            .catch(err => next(err));
    }
    else {
        return res.status(400).json(new AppResponse('Access denied ', null));
    }
}

export function remove(req, res, next) {
    let isCurrentLoggedInUserAdmin = res.locals.user.isAdmin == true ? true : false;
    if (isCurrentLoggedInUserAdmin) {
        let id = (req.params.stockId);
        repo.deleteStockById(id)
            .then(() => res.status(201).json(new AppResponse("Stock Deleted", id)))
            .catch(err => next(err));
    }
    else {
        return res.status(400).json(new AppResponse('Access denied ', null));
    }
}