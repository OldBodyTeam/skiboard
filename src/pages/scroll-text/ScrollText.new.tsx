import Header from '@components/header/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemoizedFn } from 'ahooks';
import React, { FC, PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RootStackParamList } from 'route.config';
import { configData } from './config';
import { useScreenSize } from '@hooks/useScreenSize';
import { covertCanUseCanvasData } from '@pages/draw/config';
import DrawItem from '@pages/draw/DrawItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import useBLE from '@hooks/useBLE';
import { get } from 'lodash';
import { BLEConfig } from '@utils/ble';
import { getHex } from '@utils/hex';
import Toast from 'react-native-root-toast';
type ScrollTextProps = NativeStackScreenProps<
  RootStackParamList,
  'ScrollText'
> &
  PropsWithChildren<{ name?: string }>;

const ScrollTextNew: FC<ScrollTextProps> = props => {
  const { t } = useTranslation();
  const { navigation } = props;
  const back = () => {
    navigation.navigate('Home', { screen: 'DesignScreen' });
  };
  const [textValue, setTextValue] = useState('');
  const [textStr, setTextStr] = useState<Array<string>>([]);
  const { bleWrite } = useBLE();
  const handleGenerate = useMemoizedFn(async () => {
    const str = textValue.trim().toLowerCase().split('');
    setTextStr(str);
    const covertText = str.map(v => get(BLEConfig, `scrollText.${v}`)).join('');
    await bleWrite('57d0020061');
    await bleWrite(`57EF${getHex(covertText.length / 2)}${covertText}61`);
    console.log('handleGenerate');
  });
  const { width } = useScreenSize();
  const handleScrollText = useMemoizedFn((text: string) => {
    console.log(text);
    if (text.trim().length > 0 && !/^[0-9a-zA-Z]+$/g.test(text.trim())) {
      return Toast.show(t('scroll-Tips'), {
        position: Toast.positions.CENTER,
      });
    }
    setTextValue(text);
  });
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(19, 20, 22, 1)',
        flexDirection: 'row',
      }}>
      <StatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <Header title={t('scroll-text')} handlePress={back} />
        <View
          style={{
            marginHorizontal: 10,
            display: 'flex',
            position: 'relative',
            marginBottom: 5,
          }}>
          <TextInput
            value={textValue}
            onChangeText={handleScrollText}
            placeholder={t('scroll-text-placeholder')}
            style={{
              backgroundColor: 'rgba(52,53,54,0.3)',
              borderRadius: 16,
              height: 50,
              fontSize: 14,
              paddingLeft: 16,
              width: width - 20,
              color: 'white',
            }}
          />
          <TouchableWithoutFeedback onPress={handleGenerate}>
            <View
              style={{
                width: 110,
                height: 50,
                borderRadius: 16,
                backgroundColor: '#F9DD58',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                right: 0,
              }}>
              <Text
                style={{ fontSize: 14, fontWeight: '600', color: '#131416' }}>
                {t('scroll-text-generate')}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#1C1E1F',
            borderRadius: 16,
            marginHorizontal: 10,
            marginBottom: 5,
          }}>
          {textStr.length > 0 ? (
            <View
              // className="flex items-center overflow-x-auto overflow-y-hidden bg-[rgba(52,53,54,0.3)] p-[27px] flex-wrap m-[10px] rounded-[32px]"
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#1C1E1F',
                padding: 11,
                flexWrap: 'wrap',
                borderRadius: 16,
                flexDirection: 'row',
              }}>
              {textStr.map(text => {
                const item = configData.get(text);
                if (!item) {
                  return null;
                }
                return (
                  <View
                    key={text}
                    // className="bg-[rgba(118,118,118,0.1)] w-[calc((100vw-104px)/3)] m-[5px] rounded-[32px] h-[230px] flex items-center justify-center"
                    style={{
                      backgroundColor: '#252728',
                      width: (width - 32 - 20 - 22) / 3,
                      margin: 5,
                      borderRadius: 16,
                      height: 115,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {covertCanUseCanvasData(item).map((lightText, x) => {
                      return (
                        <View
                          // className="flex justify-center items-center"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                          }}
                          key={x}>
                          {lightText.map((v, y) => {
                            return (
                              <DrawItem
                                x={x}
                                y={y}
                                key={x + y}
                                selectStatus={v.selectStatus}
                                style={{ width: 6, height: 6 }}
                                selectedColor="#F9DD58"
                              />
                            );
                          })}
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ScrollTextNew;
