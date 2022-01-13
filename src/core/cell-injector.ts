import { Base } from "./base";
import { register, inject } from "../utils";
export class CellInjector extends Base {
    static symbols = {
        ...Base.symbols,
        data: Symbol('pure data'),
    };

    static registeredName: string = 'x-taboola-cell';

    constructor() {
        super();
        this.addEventListener('error', () => {
            this?.parentNode.removeChild(this);
        }, true);
    }

    protected update() {
        const values = this.values;
        const symbols = CellInjector.symbols;
        if (!values[CellInjector.symbols.template]) {
            this.fetchTemplate();
            return;
        }
        if (!values[symbols.data]) {
            switch (true) {
                case !values['data']:
                    return;
                case typeof values['data'] === 'string':
                    try {
                        values[symbols.data] = JSON.parse(values['data']);
                    } catch (error) { }
                    // can continue checking with other urls
                    return;

                case values['data'] instanceof Promise:
                    values['data'].then((value) => {
                        values[symbols.data] = value;
                    });
                    return;
                case !!values['data']:
                    values[symbols.data] = values['data'];
                default:
            }
            return;
        }
        inject(this, values[symbols.template], values[symbols.data])
            .then(() => {
                const target = values[symbols.data]["origin"] === "sponsored" ? '_blank' : '_self';
                Array.from(this.querySelectorAll('a')).forEach((anchor) => {
                    anchor.setAttribute("target", target);
                });
            });
    }
};

export default CellInjector;

register(CellInjector.registeredName, CellInjector);
