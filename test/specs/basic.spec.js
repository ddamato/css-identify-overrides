import { expect } from 'chai';
import { DEFAULT_FN_NAME } from '../../const';

export default function suite () {
  it('should have access to the global.page', () => {
    expect(global.page).to.exist;
    expect(global.page.evaluate).to.be.a('function');
  });

  it('should visit /basic page', async () => {
    const path = await global.page.evaluate(() => window.location.pathname);
    const bodyTag = await global.page.evaluate(() => document.body.tagName);
    expect(path).to.equal('/basic');
    expect(bodyTag).to.equal('BODY');
  });

  it('should ensure module is on the page', async () => {
    const fn = await global.page.evaluate((name) => typeof window[name], DEFAULT_FN_NAME);
    expect(fn).to.equal('function');
  });
}