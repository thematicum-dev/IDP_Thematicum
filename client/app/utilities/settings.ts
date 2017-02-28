let isDev: boolean = false;
export function getBaseApi() {
    if (isDev) {
        return 'http://localhost:3000/api/';
    } else {
        return 'https://thematicum.herokuapp.com/api/';
    }
}