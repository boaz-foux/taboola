import Base from './base';

describe('a simple basic component', () => {
  let triggered = 0;
  beforeAll(async () => {
    customElements.define('test-component', class extends Base {
      constructor() {
        super();
        const p = document.createElement('p')
        p.textContent = 'It works!'
        this.appendChild(p)
      }
      update() {
        triggered++;
      }
    });
  });

  test('custom elements in JSDOM.', async () => {
    document.body.innerHTML = `<h1>Custom element test</h1> <test-component ></test-component>`
    expect(document.body.innerHTML).toContain('It works!')
  });

  test('update triggered.', async () => {
    triggered = 0;
    document.body.innerHTML = `<test-component ></test-component>`;
    expect(triggered).toEqual(1);
  });

  test('update triggered only twice, because value has not changed.', async () => {
    triggered = 0;
    document.body.innerHTML = `<test-component id="test" ></test-component>`;
    const test = <Base>document.getElementById('test');
    test.values['a'] = 'b';
    test.values['a'] = 'b';
    test.values['a'] = 'b';
    expect(triggered).toEqual(2);
  });
})