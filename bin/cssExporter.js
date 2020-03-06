import fs from 'fs';
import path from 'path';

const EXAMPLES_DIRECTORY = path.resolve(__dirname, '..', 'examples');
const PURE_CSS_FILE = 'pure.css';

fs.readFile(path.join(EXAMPLES_DIRECTORY, PURE_CSS_FILE), {encoding: 'utf8'}, (err, data) => {
  const content = `export const pure = \`${data}\``;
  fs.writeFile(path.join(EXAMPLES_DIRECTORY, 'pure.js'), content, () => {});
});