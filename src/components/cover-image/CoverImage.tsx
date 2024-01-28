import React, { FC, useEffect, useState, PropsWithChildren } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
const bgList = {
  light: {
    bg: require('../../assets/cover-img/light-bg.png'),
    style: {
      height: (567 / 2) * (Dimensions.get('window').height / 567 / 2),
      width: Dimensions.get('window').width,
    },
  },
  design: {
    bg: require('../../assets/cover-img/design-bg.png'),
    style: {
      height: (567 / 2) * (Dimensions.get('window').height / 567 / 2),
      width: Dimensions.get('window').width,
    },
  },
  music: {
    bg: require('../../assets/cover-img/music-bg.png'),
    style: {
      height: (567 / 2) * (Dimensions.get('window').height / 567 / 2),
      width: Dimensions.get('window').width,
    },
  },
};
export type CoverImageProps = { type: keyof typeof bgList } & {
  marginTop?: number;
  handleNavigation: () => void;
};
const CoverImage: FC<PropsWithChildren<CoverImageProps>> = props => {
  const { type, children, marginTop = 0, handleNavigation } = props;
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
        {children}
        <View
          style={{
            marginTop: 183 - marginTop,
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
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 14, color: '#FF7B79' }}>20%</Text>
              <View
                style={{
                  width: 27,
                  height: 14,
                  position: 'relative',
                  backgroundColor: '#6D5251',
                  overflow: 'hidden',
                  borderRadius: 5.5,
                  marginLeft: 4,
                }}>
                <View
                  style={{
                    width: 10,
                    height: '100%',
                    backgroundColor: '#FF7B79',
                  }}
                />
              </View>
              <View
                style={{
                  width: 2,
                  height: 5,
                  borderRadius: 1,
                  backgroundColor: '#6D5251',
                  marginLeft: 1,
                }}
              />
            </View>
          </View>
          <TouchableOpacity>
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
              <Image
                source={require('../../assets/cover-img/go.png')}
                style={{ width: 16, height: 16 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigation}>
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
              <Image
                source={require('../../assets/cover-img/people.png')}
                style={{ width: 16, height: 16 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};
export default CoverImage;
