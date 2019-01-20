export class GoogleCustomSearchModel {
    constructor(
        public _id?: string,
        public snippet?: string,
        public url?: string,
        public title?: string,
        public source?: string,
        public relevancyRanking?: number,
        public userUpVoted?: boolean
    ) {}
}