import useBLE from '@hooks/useBLE';
import React, { FC, useEffect, useState, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
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
  handleNavigationPerson: () => void;
  handleNavigationDevice: () => void;
  bottom: number;
};
const CoverImage: FC<PropsWithChildren<CoverImageProps>> = props => {
  const {
    type,
    children,
    marginTop = 0,
    handleNavigationPerson,
    handleNavigationDevice,
    bottom,
  } = props;
  const [height, setHeight] = useState<number>(0);
  useEffect(() => {
    const img = Image.resolveAssetSource(bgList[type].bg);
    const maxHeight = Dimensions.get('window').height;
    const maxWidth = Dimensions.get('window').width;
    const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
    setHeight(img.height * ratio);
  }, [type]);
  const { getBLEBatteryPower } = useBLE();
  const [batteryPower, setBatteryPower] = useState('100');
  getBLEBatteryPower().then(data => {
    setBatteryPower(data ?? '0');
  });
  const { t } = useTranslation();
  return (
    <View>
      <ImageBackground
        source={bgList[type].bg}
        style={{
          height,
          width: Dimensions.get('screen').width,
          position: 'relative',
        }}>
        {children}
        <View
          style={{
            marginTop: 183 - marginTop,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'absolute',
            left: 25,
            bottom,
            width: Dimensions.get('screen').width - 50,
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
            <Text style={{ fontSize: 14, color: 'white' }}>
              {t('ble-Connected')}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: parseInt(batteryPower, 10) <= 20 ? '#FF7B79' : 'green',
                }}>
                {parseInt(batteryPower, 10)}%
              </Text>
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
                    width: (parseInt(batteryPower, 10) / 100) * 27,
                    height: '100%',
                    backgroundColor:
                      parseInt(batteryPower, 10) <= 20 ? '#FF7B79' : 'green',
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
          <TouchableOpacity onPress={handleNavigationDevice}>
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
          <TouchableOpacity onPress={handleNavigationPerson}>
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
