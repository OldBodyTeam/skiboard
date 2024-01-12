import React, { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  FlatList,
  Image,
  TouchableHighlight,
} from 'react-native';
import DeviceListItem from './DeviceListItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'route.config';
type DeviceListProps = NativeStackScreenProps<
  RootStackParamList,
  'DeviceList'
> &
  PropsWithChildren<{ name?: string }>;
const DeviceList = ({ navigation }: DeviceListProps) => {
  const handleGoBack = () => {
    navigation.navigate('Home');
  };
  return (
    <SafeAreaView style={{ backgroundColor: '#000000', flex: 1 }}>
      <StatusBar />
      <View
        style={{
          height: 74,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            position: 'absolute',
            left: 16,
            top: 16.5,
          }}>
          <TouchableHighlight
            onPress={handleGoBack}
            style={{
              width: 41,
              height: 41,
              borderRadius: 41,
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../assets/header-back.png')}
              style={{ width: 16, height: 16 }}
            />
          </TouchableHighlight>
        </View>

        <Text style={{ color: 'white', fontWeight: '600', fontSize: 20 }}>
          Devices
        </Text>
      </View>
      <FlatList
        style={{ paddingTop: 4 }}
        data={Array(30)
          .fill(1)
          .map(() => {
            return { index: Math.random() };
          })}
        renderItem={item => (
          <DeviceListItem key={item.index} device={item.index} />
        )}
        keyExtractor={item => item.index + ''}
      />
    </SafeAreaView>
  );
};
export default DeviceList;
