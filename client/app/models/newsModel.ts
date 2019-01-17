export class NewsModel {
    constructor(
        public _id?: string,
        public author?: string,
        public description?: string,
        public url?: string,
        public urlToImage?: string,
        public title?: string,
        public source?: string,
        public publishedAt?: Date,
        public relevancyRanking?: number,
        public userVoted?: boolean
    ) {}
}