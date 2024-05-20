import { editLight } from '@config/edit-light';
import { glow } from '@config/glow';
import { led } from '@config/led';
import { lightScreen } from '@config/light-screen';
import { musicScreen } from '@config/music-screen';
import { scrollText } from '@config/scroll-text';
import { sense } from '@config/sense';
import { sensitivity } from '@config/sensitivity';
import { mode } from '@config/mode';

const BLEConfig = {
  designScreen: {
    openLight: '5701020161',
    closeLight: '5701020061',
  },
  scrollText,
  lightScreen,
  musicScreen,
  sense,
  led,
  glow,
  sensitivity,
  editLight,
  mode,
};
export { BLEConfig };
