import React, { FC } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
type ModeButtonProps = { handleMode?: () => void; style: StyleProp<ViewStyle> };
const ModeButton: FC<ModeButtonProps> = props => {
  const { handleMode, style } = props;
  return (
    <Pressable onPress={handleMode} style={style}>
      <View
        style={{
          width: 336 / 2,
          height: 86 / 2,
          borderRadius: 43,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(29, 33, 34, 1)',
        }}>
        <Text style={{ fontWeight: 'bold', color: 'white' }}>NameName</Text>
      </View>
    </Pressable>
  );
};
export default ModeButton;
