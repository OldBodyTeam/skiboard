import React, { FC } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
export type HeaderProps = {
  title: string;
  handlePress: () => void;
};
const Header: FC<HeaderProps> = props => {
  const { title, handlePress } = props;
  return (
    <View
      style={{
        height: 74,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
      }}>
      <View
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          position: 'absolute',
          left: 0,
          height: '100%',
          top: 0,
          paddingHorizontal: 16,
        }}>
        <TouchableOpacity
          style={{
            width: 41,
            height: 41,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 41,
            backgroundColor: 'rgba(255,255,255,0.15)',
          }}
          onPress={handlePress}>
          <Image
            source={require('../../assets/back.png')}
            style={{ width: 16, height: 16 }}
          />
        </TouchableOpacity>
      </View>
      <Text style={{ fontWeight: '600', fontSize: 20, color: 'white' }}>
        {title}
      </Text>
    </View>
  );
};
export default Header;
