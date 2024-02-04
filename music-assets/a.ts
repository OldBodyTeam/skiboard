import fs from 'node:fs';
import path from 'node:path';
const getCodeStr = (data: string[]) => `
import { artwork } from './artwork';
const musicData = ${JSON.stringify(data)}
export const playlistData = musicData.map((item, index) => {
  return {
    title: item,
    artwork: artwork[index],
  };
});`;
const data = fs.readdirSync(path.resolve(process.cwd()), {
  encoding: 'utf-8',
});
fs.writeFileSync(
  path.join(process.cwd(), '../src/components/music-player/assets/playlist.ts'),
  getCodeStr(data),
  {
    encoding: 'utf-8',
  },
);
