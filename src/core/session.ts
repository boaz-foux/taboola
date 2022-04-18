import { isMobile } from "../utils";


export class Session {
    static apikey: string = '';
    static id: number = -1;
    static get valid() {
        return Session.id > 0 && Session.apikey;
    }
    static async fetch(settings: { count: number }) {
        if (!Session.valid) {
            throw new Error('invalid session, could not pull data');
        }
        const base = 'https://api.taboola.com/1.0/json/taboola-templates/recommendations.get';
        const parameters = [
            ['source.type', 'video'],
            ['count', settings.count],
            ['source.id', Session.id],
            ['app.apikey', Session.apikey],
            ['app.type', isMobile() ? 'mobile' : 'desktop'],
        ].map(([key, value]) => `${key}=${value}`).join('&')
        const url = `${base}?${parameters}`;
        const response = await fetch(url);
        let list = (await response.json())['list'];
        if (!(list?.length)) {
            const mock = await import("./mock.json");
            const mockData = [].concat(mock.list).sort(() => Math.random());
            list = Array(settings.count).fill(0).map((x, i) => mockData[i % mockData.length]);
        }
        return list;
    }
}

export default Session;