import { playlistData } from '@components/music-player/assets/playlist';

const musicListData = Array(6)
  .fill(1)
  .map((_, index) => {
    let start = index * 6 > 26 ? index * 6 - 26 : index * 6;
    let end = (index + 1) * 6 > 26 ? (index + 1) * 6 - 26 : (index + 1) * 6;
    let startIndex = start < end ? start : end;
    let endIndex = end > start ? end : start;
    return {
      index: index + 1,
      data: [...playlistData].slice(startIndex, endIndex),
      startIndex,
      endIndex,
    };
  });
console.log(musicListData[3]);
export { musicListData };
