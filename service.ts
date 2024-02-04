import TrackPlayer from 'react-native-track-player';
const init = async () => {
  await TrackPlayer.setupPlayer();
};
export default init;
