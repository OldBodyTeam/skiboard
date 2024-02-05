import { MODULENAME } from '@pages/sound-effects/SoundEffects';
import React, { FC } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
type ModeButtonProps = {
  handleMode: (moduleName: MODULENAME) => void;
  style: StyleProp<ViewStyle>;
  moduleName: MODULENAME;
  selectModuleName?: MODULENAME;
};
const ModeButton: FC<ModeButtonProps> = props => {
  const { handleMode, style, moduleName, selectModuleName } = props;
  return (
    <Pressable onPress={() => handleMode(moduleName)} style={style}>
      <View
        style={{
          width: 336 / 2,
          height: 86 / 2,
          borderRadius: 43,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:
            selectModuleName === moduleName
              ? 'rgba(250, 237, 69, 1)'
              : 'rgba(29, 33, 34, 1)',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            color:
              selectModuleName === moduleName ? 'rgba(0, 0, 0, 1)' : 'white',
          }}>
          {moduleName}
        </Text>
      </View>
    </Pressable>
  );
};
export default ModeButton;
