import React, { useState } from 'react';
import { Switch } from 'react-native-switch';
const SwitchCom = () => {
  const [openMusic, setOpenMusic] = useState<boolean>(false);
  return (
    <Switch
      value={openMusic}
      onValueChange={setOpenMusic}
      disabled={false}
      activeText={'On'}
      inActiveText={'Off'}
      circleSize={28}
      barHeight={36}
      backgroundActive={'rgba(255, 255, 255, 1)'}
      backgroundInactive={'rgba(255, 255, 255, 1)'}
      circleActiveColor={'rgba(0, 0, 0, 1)'}
      circleInActiveColor={'rgba(0, 0, 0, 1)'}
      changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
      innerCircleStyle={{
        alignItems: 'center',
        justifyContent: 'center',
      }} // style for inner animated circle for what you (may) be rendering inside the circle
      switchLeftPx={4} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
      switchRightPx={4} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
      containerStyle={{ width: 146 }}
      activeTextStyle={{
        color: 'black',
        fontSize: 14,
        fontWeight: '600',
      }}
      inactiveTextStyle={{
        color: 'black',
        fontSize: 14,
        fontWeight: '600',
      }}
      switchWidthMultiplier={2.7}
      switchBorderRadius={36}
    />
  );
};
export default SwitchCom;
