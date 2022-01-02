import CellInjector from './cell-injector';

describe('a simple cell component', () => {
   const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  test('a simple cell should support asynchronous changes when receiving new data. ', async () => {
    const tag = CellInjector.registeredName;
    const element = <CellInjector>document.createElement(tag);
    element.setAttribute('template-id', 'template-card');
    document.body.innerHTML = `
      <template id="template-card">
        <p>{{test1.test2.test3}}</p>
      </template>
    `;
    const greetings = 'hello everybody!';
    document.body.appendChild(element);
    element.values['data'] = {
      test1: {
        test2: {
          test3: greetings,
        }
      }
    };
    await timeout(50);
    expect(document.body.innerHTML).toContain(greetings);
  });

});

