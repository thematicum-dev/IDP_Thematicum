import ThemeFundComposition from '../models/themeFundComposition';
import UserThemeFundAllocation from '../models/userThemeFundAllocation';
import {AppError} from '../utilities/appError';
import {AppResponse} from '../utilities/appResponse';
import DataRepository from '../data_access/dataRepository';
import ActivityLog from '../models/activitylog';

const repo = new DataRepository();

export function createMany(req, res, next) {
    //add many funds

    Promise.all(req.body.fundAllocation.map(allocationData =>{
        repo.createFundCompositionAndAllocation(allocationData, req.theme, res.locals.user);
    }))
        .then(result => {
            return res.status(201).json(new AppResponse('Theme-fund compositions and allocations created', result));
        })
        .catch(error => { next(error) });
}

export function create(req, res, next) {

    const fundAllocation = new UserThemeFundAllocation({
        user: res.locals.user,
        themeFundComposition: req.themeFundComposition,
        exposure: req.body.exposure
    });

    repo.storeNewsFeedBasedOnFundAllocation(fundAllocation).then(results =>{
        return repo.createFundAllocation(req.themeFundComposition, res.locals.user, req.body.exposure);
    }).then(results =>{
        res.status(201).json(new AppResponse('Fund allocation created', results))
    }).catch(err => next(err));
}

export function update(req, res, next) {
    //TODO: check implementation
    let fundAllocation = req.fundAllocation;
    fundAllocation.exposure = req.body.exposure;

    // repo.storeNewsFeedBasedOnFundAllocation(fundAllocation).then(results =>{
    // }).then(results =>{
    //     return repo.save(fundAllocation);
    // }).then(results =>{
    //     res.status(201).json(new AppResponse('Fund allocation updated', results))
    // }).catch(err => next(err));
}

export function listByTheme(req, res, next) {
    repo.getThemeFundCompositionsByTheme(req.theme._id)
        .then(results => Promise.all(results.map(composition => repo.getFundAllocationsByThemeFundComposition(composition, res.locals.user._id))))
        .then(results => {
            return res.status(200).json(new AppResponse('Fund allocation data retrieved', results));
        })
        .catch(err => next(err));
}

export function deleteFundAllocation(req, res, next) {
    const fundAllocation = req.fundAllocation;
    const compositionId = fundAllocation.themeFundComposition;

    repo.remove(fundAllocation)
        .then(() => {
            return repo.notExistFundAllocationsForThemeFundComposition(compositionId);
        })
        .then(notExistFundAllocation => {
            if (notExistFundAllocation) {
                repo.removeFundTagFromTheme(compositionId).then(function(){
                    return repo.removeById(ThemeFundComposition, compositionId);
                })
                    .catch(err => reject(err));
            }
        })
        .then(() => {
            return res.status(200).json(new AppResponse('Fund allocation deleted', null));
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

export function themeFundCompositionById(req, res, next, id) {
    repo.getById(ThemeFundComposition, id)
        .then(result => {
            if (!result) {
                return next(new AppError('No theme-fund composition found for the given Id', 404));
            }

            req.themeFundComposition = result;
            next();
        })
        .catch(err => next(err));
}

export function fundAllocationById(req, res, next, id) {
    repo.getById(UserThemeFundAllocation, id)
        .then(result => {
            if (!result) {
                return next(new AppError('No fund allocation found for the given Id', 404));
            }

            //TODO: (maybe refactor) authorization check
            //"user" field of UserThemeFundAllocation is not populated => can check directly on it, instead of populating and checking its _id
            if (res.locals.user && result.user.equals(res.locals.user._id)) {
                req.fundAllocation = result;
                return next();
            }

            return next(new AppError('Not authorized', 403));
        })
        .catch(err => next(err));
}