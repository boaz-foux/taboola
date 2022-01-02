export class Base extends HTMLElement {
    static symbols = {
        template: Symbol('the real template element'),
    };

    protected update(): void {
        throw new Error('this function needs to be overridden!');
    };
    private calculatedValue(symbol: Symbol | string) {
        if (typeof symbol === 'symbol') {
            return this[symbol];
        }
        const string: string = <string>symbol;
        return this.getAttribute(string) || this[string] || null;
    }
    get values() {
        return new Proxy(this, {
            get(self, symbol, receiver) {
                return self.calculatedValue(symbol);
            },
            set(self, symbol, value, receiver) {
                if (self.calculatedValue(symbol) !== value) { // better & safer with deep equal
                    self[symbol] = value;
                    self.update();
                }
                return value;
            }
        });
    }
    connectedCallback() {
        this.update();
    }
    attributeChangedCallback() {
        this.update();
    }

    protected fetchTemplate() {
        if (this.values[Base.symbols.template]) {
            return;
        }
        const id = this.values['template-id'];
        if (!id) { return; }
        const templateElement = <HTMLTemplateElement>document.getElementById(id);
        this.values[Base.symbols.template] = templateElement;
    }
};

export default Base;