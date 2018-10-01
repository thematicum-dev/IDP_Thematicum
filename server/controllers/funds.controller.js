import Fund from '../models/fund';
import { AppError } from '../utilities/appError';
import { AppResponse } from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';

const repo = new DataRepository();

export function list(req, res, next) {
    repo.getAll(Fund)
        .then(results => {
            if (!results) {
                return next(new AppError('No funds found', 404));
            }

            return res.status(200).json(new AppResponse('Funds retrieved', results));
        })
        .catch(err => next(err));
}

export function create(req, res, next) {
    repo.nextFundSeqNr().then(function (seqNr) {
        const fund = new Fund({
            seqNr: seqNr,
            fundName: req.body.name.toUpperCase(),
            fundParent: req.body.parent.toUpperCase(),
            fundIsin: req.body.isin.toUpperCase(),
            addedBy: res.locals.user
        });

        repo.save(fund)
            .then(() => res.status(201).json(new AppResponse('Fund added', fund)))
            .catch(err => next(err));
    });
}

export function update(req, res, next) {
    let isCurrentLoggedInUserAdmin = res.locals.user.isAdmin == true ? true : false;
    if (isCurrentLoggedInUserAdmin) {
        const fund = new Fund({
            _id: req.body._id,
            fundName: req.body.name.toUpperCase(),
            fundParent: req.body.parent.toUpperCase(),
            foundIsin: req.body.isin.toUpperCase(),
            addedBy: res.locals.user
        });
        repo.update(Fund, { "_id": fund._id }, fund)
            .then(() => res.status(201).json(new AppResponse("Fund Updated", fund)))
            .catch(err => next(err));
    }
    else {
        return res.status(400).json(new AppResponse('Access denied ', null));
    }
}

export function remove(req, res, next) {
    let isCurrentLoggedInUserAdmin = res.locals.user.isAdmin == true ? true : false;
    if (isCurrentLoggedInUserAdmin) {
        let id = (req.params.fundId);
        repo.deleteFundById(id)
            .then(() => res.status(201).json(new AppResponse("Fund Deleted", id)))
            .catch(err => next(err));
    }
    else {
        return res.status(400).json(new AppResponse('Access denied ', null));
    }
}