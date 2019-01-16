import {AppResponse} from "../utilities/appResponse";
import DataRepository from "../data_access/dataRepository";


const repo = new DataRepository();


let urlExists = require('url-exists-deep');


export function removeObsoleteURLs(req, res, next) {

    repo.getAllReports()
        .then((reports) => {
            for (let i=0; i<reports.length; i++) {

                urlExists(reports[i]['link'], undefined, 'GET', 60000)
                    .then(function(response){
                        if (response) {
                            console.log("Url exists", response.href);
                        } else {
                            console.log("Url does not exists!");
                            console.log(response);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        });

    return res.status(200).json(new AppResponse("OK"));

}
