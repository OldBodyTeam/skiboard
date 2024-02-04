import { artwork } from './artwork';
const musicData = [
  'Ocean-of-Thought.mp3',
  'peritune.mp3',
  'Colorful-Flowers.mp3',
  'Hard.mp3',
  'Purple-Dream.mp3',
  'Jingle-Bells-Ukulele.mp3',
  'Cats-Cradle.mp3',
  'Christmas-Snow.mp3',
  'Lights.mp3',
  'Moon-Waltz.mp3',
  'Sakuya2.mp3',
  'DRIVE.mp3',
  'Clown.mp3',
  'IceCream.mp3',
  'Born-To-Drive.mp3',
  'Cooking.mp3',
  'Positive-Hip-Hop.mp3',
  'Girl-Love.mp3',
  'Summertime.mp3',
  'Smooth-Operator.mp3',
  'Its-Your-Birthday.mp3',
  'Inspiring-Acoustic-Guitar.mp3',
  'Sock-Hop.mp3',
  'Dance.mp3',
  'Innocence.mp3',
  'Dancin.mp3',
];
export const playlistData = musicData.map((item, index) => {
  return {
    title: item,
    artwork: artwork[index],
    icon: artwork[index],
    url: `https://ski-music.oss-cn-beijing.aliyuncs.com/music-assets/${item}`,
  };
});
