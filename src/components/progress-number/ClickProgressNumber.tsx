import React, { FC, useEffect, useState } from 'react';
import useBLE from '@hooks/useBLE';
import { BLEConfig } from '@utils/ble';
import { led } from '@config/led';
import { glow } from '@config/glow';
import SliderDraw from '@pages/draw/SliderDraw';
import { useAtom } from 'jotai';
import { glowAtom, ledAtom } from '@stores/led/led';
import { useMemoizedFn } from 'ahooks';
import { useSend } from '@utils/send';

const ClickProgressNumber: FC<{ mode: 'glow' | 'led' }> = props => {
  const { mode } = props;
  const [showIndex, setShowIndex] = useState(0);
  const [ledValue, setLedValue] = useAtom(ledAtom);
  const [glowValue, setGlowValue] = useAtom(glowAtom);
  const { bleWrite } = useBLE();
  const { queue, consumer } = useSend();
  const getCode = useMemoizedFn((index: number) => {
    if (mode === 'led') {
      const code = BLEConfig.led[String(index) as keyof typeof led];
      // bleWrite(code);
      ledValue.reverse ? queue.enqueue(ledValue.reverse) : null;
      queue.enqueue(ledValue.title);
      queue.enqueue(code);
      setLedValue(prev => {
        return {
          ...prev,
          speed: code,
        };
      });
    } else if (mode === 'glow') {
      const code = BLEConfig.glow[String(index) as keyof typeof glow];
      glowValue.reverse ? queue.enqueue(glowValue.reverse) : null;
      queue.enqueue(glowValue.title);
      queue.enqueue(code);
      // bleWrite(code);
      setGlowValue(prev => {
        return {
          ...prev,
          speed: code,
        };
      });
    }
    consumer.startConsuming(bleWrite);
    setShowIndex(index);
  });
  // useEffect(() => {
  //   if (mode === 'led') {
  //     bleWrite(BLEConfig.led[String(showIndex) as keyof typeof led]);
  //   } else if (mode === 'glow') {
  //     bleWrite(BLEConfig.glow[String(showIndex) as keyof typeof glow]);
  //   }
  // }, [bleWrite, mode, showIndex]);

  return <SliderDraw speed={showIndex} onChange={getCode} />;
};

export default ClickProgressNumber;
