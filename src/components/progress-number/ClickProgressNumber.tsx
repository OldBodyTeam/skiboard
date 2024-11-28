import React, { FC, useEffect, useState } from 'react';
import useBLE from '@hooks/useBLE';
import { BLEConfig } from '@utils/ble';
import { led } from '@config/led';
import { glow } from '@config/glow';
import SliderDraw from '@pages/draw/SliderDraw';

const ClickProgressNumber: FC<{ mode: 'glow' | 'led' }> = props => {
  const { mode } = props;
  const [showIndex, setShowIndex] = useState(0);

  const { bleWrite } = useBLE();
  useEffect(() => {
    console.log('***********', showIndex);
    if (mode === 'led') {
      bleWrite(BLEConfig.led[String(showIndex) as keyof typeof led]);
    } else if (mode === 'glow') {
      bleWrite(BLEConfig.glow[String(showIndex) as keyof typeof glow]);
    }
  }, [bleWrite, mode, showIndex]);

  return <SliderDraw speed={showIndex} onChange={setShowIndex} />;
};

export default ClickProgressNumber;
