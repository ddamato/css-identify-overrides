import { expect } from 'chai';
import { DEFAULT_FN_NAME } from '../../const';

const pure = `:root {
  --ux-blue--400: #1976d2;
  --ux-white--100: #ffffff;
  --ux-black--100: #111111;
}

:root {
  --button-backgroundColor: var(--ux-blue--400);
  --button-foregroundColor: var(--ux-white--100);
  --button-borderColor: var(--ux-blue--400);
}

.ux-btn {
  all: unset;
  font: inherit;
  padding: .5rem 1rem;

  background-color: var(--button-backgroundColor);
  color: var(--button-foregroundColor);
  border: 1px solid var(--button-borderColor);
}

.ux-btn--icon {
  padding-right: 2rem;
  background-color: blue;
}`;

export default function suite () {
  it('should return empty if no styles are provided', async () => {
    const result = await global.page.evaluate((name) => window[name](), DEFAULT_FN_NAME);
    expect(result).to.be.empty;
  });

  it('should return empty if no overrides are found', async () => {
    const result = await global.page.evaluate((name) => window[name](), DEFAULT_FN_NAME);
    expect(result).to.be.empty;
  });

  it('should return found overrides', async () => {
    const result = await global.page.evaluate((name, styles) => window[name](styles), DEFAULT_FN_NAME, pure);

    const paddingKeys = [
      'padding-top',
      'padding-bottom',
      'padding-left',
      'padding-right'
    ];

    expect(result.length).to.equal(3);

    expect(result[0].element).to.exist;
    expect(result[0].declarations.length).to.equal(2);
    expect(result[0].declarations[0].properties).to.have.keys(['background-color']);
    expect(result[0].declarations[1].properties).to.have.keys(['width', 'text-align']);

    expect(result[1].element).to.exist;
    expect(result[1].declarations.length).to.equal(1);
    expect(result[1].declarations[0].properties).to.have.keys(paddingKeys);

    expect(result[2].element).to.exist;
    expect(result[2].declarations.length).to.equal(1);
    expect(result[2].declarations[0].properties).to.have.keys(paddingKeys);
  });
}