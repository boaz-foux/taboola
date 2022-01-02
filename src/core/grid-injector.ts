import { Session } from "./session";
import { Base } from "./base";
import { CellInjector } from "./cell-injector";
import { register, inject } from "../utils";

/*
    using attribute count
*/
export default class GridInjector extends Base {
    static symbols = {
        ...CellInjector.symbols,
        hasFetched: Symbol('has fetched data'),
        done: Symbol('grid injector is done'),
    };
    
    static registeredName: string = 'x-taboola-grid';

    private fetchData() {
        this.values[GridInjector.symbols.hasFetched] = true;
        const count: number = +this.values['count'];
        Session.fetch({ count }).then((data) => {
            this.values[GridInjector.symbols.data] = data.splice(0, count);
        });
    }
    private async renderData() {
        const symbols = GridInjector.symbols;
        const values = this.values;

        values[symbols.done] = true;
        const array = values[symbols.data];
        if (!Array.isArray(array)) {
            console.error('invalid data', array);
            return;
        }
        const originalTemplate = values[symbols.template];
        let template = values[symbols.template];
        template = template.content.querySelector('template') || template;
        const deepTemplate = originalTemplate !== template; // is <template> <template /> </template>

        let hook: Node;
        if (deepTemplate) {
            await inject(this, values[symbols.template], {});
            hook = this.querySelector('template');
            array.reverse();
        }
        array.forEach((data) => {
            const node = <CellInjector>document.createElement(CellInjector.registeredName);
            node.values[GridInjector.symbols.template] = template;
            node.values[GridInjector.symbols.data] = data;
            if (deepTemplate) {
                hook.parentElement.insertBefore(node, hook);
                return;
            }
            this.appendChild(node);
        });
        if (hook) {
            hook.parentNode.removeChild(hook);
        }
    }

    update() {
        const symbols = GridInjector.symbols;
        const values = this.values;
        switch (true) {
            case values[symbols.done]:
                return;
            case !values[symbols.template]:
                this.fetchTemplate();
                return;
            case !values[symbols.data] &&
                !values[symbols.hasFetched]:
                this.fetchData();
                return;
            case !!values[symbols.data]:
                this.renderData();
                break;
            default:
        }
    }
};

register(GridInjector.registeredName, GridInjector);
