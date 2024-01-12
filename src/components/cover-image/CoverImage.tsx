import React, { FC, useEffect, useState } from 'react';
import { Dimensions, Image, ImageBackground, Text, View } from 'react-native';
const bgList = {
  light: {
    bg: require('../../assets/cover-img/light-bg.png'),
    style: {
      height: (567 / 2) * (Dimensions.get('window').height / 567 / 2),
      width: Dimensions.get('window').width,
    },
  },
};
export type CoverImageProps = { type: keyof typeof bgList };
const CoverImage: FC<CoverImageProps> = props => {
  const { type } = props;
  const [height, setHeight] = useState<number>(0);
  useEffect(() => {
    const img = Image.resolveAssetSource(bgList[type].bg);
    const maxHeight = Dimensions.get('window').height;
    const maxWidth = Dimensions.get('window').width;
    const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
    setHeight(img.height * ratio);
  }, [type]);
  return (
    <View>
      <ImageBackground
        source={bgList[type].bg}
        style={{
          height,
          width: Dimensions.get('window').width,
        }}>
        <View>
          <Text>111</Text>
          <Text>111</Text>
        </View>
        <View
          style={{
            marginTop: 183,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 25,
            paddingRight: 25,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
              height: 50,
              borderRadius: 50,
              backgroundColor: '#000000',
              paddingHorizontal: 16,
            }}>
            <Text style={{ fontSize: 14, color: 'white' }}>Connected</Text>
            <Text>111</Text>
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: '#000000',
              marginLeft: 8,
            }}>
            <Text>11</Text>
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: '#000000',
              marginLeft: 8,
            }}>
            <Text>11</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
export default CoverImage;
