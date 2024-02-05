import Base from './core/base';
import { inject } from './utils';
const promise=  import('./taboola');
setTimeout(async () => {
    const taboola = (await promise).default;
    taboola.init({
        apikey: "f9040ab1b9c802857aa783c469d0e0ff7e7366e4",
        id: 214321562187
    })
        .then(async () => {
            {
                const root = document.getElementById('single-card');
                const template = <HTMLTemplateElement>document.getElementById('template-card');
                inject(
                    root,
                    template,
                    Promise.resolve({
                        include :{
                            it: true,
                        },
                        test1: {
                            test2: {
                                test3: 'Cool!'
                            }
                        }
                    }),
                );

            };
            // x-taboola-cell
            {
                const root = <Base>document.getElementById('single-card-2');
                const data = Promise.resolve({
                    test1: {
                        test2: {
                            test3: 'Beans!'
                        }
                    }
                });
                root.values['data'] = data;
            };
        });
}, 1000);

