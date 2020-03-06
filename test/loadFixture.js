import path from 'path';
import fs from 'fs';

const FIXTURE_DIRECTORY = path.resolve(__dirname, 'fixtures');

export default async function loadFixture (fileName) {
  const filePath = path.join(FIXTURE_DIRECTORY, fileName);
  try {
    return await fs.readFileSync(filePath, { encoding: 'utf8' });
  } catch (e) {
    throw new Error(e);
  }
}