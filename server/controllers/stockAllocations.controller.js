import ThemeStockComposition from '../models/themeStockComposition';
import UserThemeStockAllocation from '../models/userThemeStockAllocation';
import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';

const repo = new DataRepository();

export function createMany(req, res, next) {
    //add many stocks
    Promise.all(req.body.stockAllocation.map(allocationData =>
            repo.createStockCompositionAndAllocation(allocationData, req.theme, res.locals.user)))
        .then(result => {
            return res.status(201).json(new AppResponse('Theme-stock compositions and allocations created', result));
        })
        .catch(error => { next(error) });
}

export function create(req, res, next) {
    repo.createStockAllocation(req.themeStockComposition, res.locals.user, req.body.exposure)
        .then(result => {
            return res.status(201).json(new AppResponse('Stock allocation created', result));
        })
        .catch(error => { next(error) });
}

export function update(req, res, next) {
    //TODO: check implementation
    let stockAllocation = req.stockAllocation;
    stockAllocation.exposure = req.body.exposure;

    repo.save(stockAllocation)
        .then(result => {return res.status(200).json(new AppResponse('Stock allocation updated', result)) })
        .catch(err => next(err));
}

export function listByTheme(req, res, next) {
    repo.getThemeStockCompositionsByTheme(req.theme._id)
        .then(results => Promise.all(results.map(composition => repo.getStockAllocationsByThemeStockComposition(composition, res.locals.user._id))))
        .then(results => {
            return res.status(200).json(new AppResponse('Stock allocation data retrieved', results));
        })
        .catch(err => next(err));
}

export function deleteStockAllocation(req, res, next) {
    const stockAllocation = req.stockAllocation;
    const compositionId = stockAllocation.themeStockComposition;

    repo.remove(stockAllocation)
        .then(() => {
            return repo.notExistStockAllocationsForThemeStockComposition(compositionId);
        })
        .then(notExistStockAllocation => {
            if (notExistStockAllocation) {
                return repo.removeById(ThemeStockComposition, compositionId);
            }
        })
        .then(() => {
            return res.status(200).json(new AppResponse('Stock allocation deleted', null));
        })
        .catch(err => next(err));
}

export function themeById(req, res, next, id) {
    repo.getThemeById(id)
        .then(result => {
            if (!result) {
                return next(new AppError('No theme found for the given Id', 404))
            }

            req.theme = result;
            next();
        })
        .catch(err => next(err));
}

export function themeStockCompositionById(req, res, next, id) {
    repo.getById(ThemeStockComposition, id)
        .then(result => {
            if (!result) {
                return next(new AppError('No theme-stock composition found for the given Id', 404));
            }

            req.themeStockComposition = result;
            next();
        })
        .catch(err => next(err));
}

export function stockAllocationById(req, res, next, id) {
    repo.getById(UserThemeStockAllocation, id)
        .then(result => {
            if (!result) {
                return next(new AppError('No stock allocation found for the given Id', 404));
            }

            //TODO: (maybe refactor) authorization check
            //"user" field of UserThemeStockAllocation is not populated => can check directly on it, instead of populating and checking its _id
            if (res.locals.user && result.user.equals(res.locals.user._id)) {
                req.stockAllocation = result;
                return next();
            }

            return next(new AppError('Not authorized', 403));
        })
        .catch(err => next(err));
}