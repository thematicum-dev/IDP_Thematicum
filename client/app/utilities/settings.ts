let isDev: boolean = false;
export function getBaseApi(): string {
    if (isDev) {
        return 'http://localhost:3000/api/';
    } else {
        return 'https://thematicum.herokuapp.com/api/';
    }
}
