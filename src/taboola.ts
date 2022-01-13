
import { Session } from './core/session';
class MainInterface {
    async load() {
        await import('./core/cell-injector');
        await import('./core/grid-injector');
    }
    async init(settings: { apikey: string, id: number }) {
        Session.id = settings.id;
        Session.apikey = settings.apikey;
        if (!Session.valid) {
            throw new Error('invalid session.');
        }
        return await this.load(); // for error wise;
    }
};

const mainInterface = new MainInterface;

window['taboola'] = mainInterface;

export default mainInterface;

{   // auto loading with apikey and xid attributes
    const apikey = document?.currentScript?.getAttribute('apikey');
    const id = Number(document?.currentScript?.getAttribute('xid'));
    if (apikey && id) {
        mainInterface.init({ apikey, id })
            .then(() => {
                console.log('taboola > has loaded');
            })
            .catch(() => {
                console.log('taboola > loading failed');
            });
    }
}