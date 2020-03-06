import path from 'path';
import getPort from 'get-port';
import Koa from 'koa';
import Router from 'koa-router';
import puppeteer from 'puppeteer';
import assert from 'assert';
import { specifications } from './specs/index.js';
import loadFixture from './loadFixture';
import { DIST_MIN_FILE } from '../const';

const IS_HEADLESS = true;

describe('css-idenitify-overrides', () => {
  let port, server, browser, page;
  
  before(async () => {
    port = await getPort();
  })

  describe('Emulate client-side experience', () => {
    
    it('should start server', () => {
      const app = new Koa();
      const router = new Router();

      router.get('/:html', async (ctx) => {
        ctx.body = await loadFixture(`${ctx.params.html}.html`);
      });

      app.use(router.routes()).use(router.allowedMethods());
      server = app.listen(port);
      assert.ok(server);
    });

    it('should launch puppeteer', async () => {
      browser = await puppeteer.launch({ headless: IS_HEADLESS });
      assert.ok(browser);
    });

    it('should create a new page', async () => {
      page = await browser.newPage();
      page.on('console', (log) => console[log._type](log._text));
      assert.ok(page);
    });

  });

  describe('Execute unit test suite', () => {
    before(() => {
      global.page = page;
    });

    beforeEach(async function () {
      const dist = path.resolve(__dirname, '..', 'dist', DIST_MIN_FILE);
      const fixture = this.currentTest.parent.title;
      await global.page.goto(`http://localhost:${port}/${fixture}`, { waitUntil: 'networkidle0' });
      await global.page.addScriptTag({ path: dist });
    });

    Object.keys(specifications).forEach((spec) => {
      describe(spec, specifications[spec]);
    });
  });

  describe('Shutdown client-side experience', () => {
    it('should close the page', () => {
      return page.close();
    });

    it('should close the browser', () => {
      return browser.close();
    });

    it('should shutdown the server', () => {
      return server.close();
    });
  });
});


