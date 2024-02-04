import CoverImage from '@components/cover-image/CoverImage';
import { TabParamList } from '@pages/home/tab-config';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { PropsWithChildren, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';
import { RootStackParamList } from 'route.config';
import type { CompositeScreenProps } from '@react-navigation/native';
import SVGNum from '@components/svg-num/SVGNum';

type DesignScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'DesignScreen'>,
  NativeStackScreenProps<RootStackParamList, 'Home'>
> &
  PropsWithChildren<{ name?: string }>;
const DesignScreen = (props: DesignScreenProps) => {
  const { navigation } = props;
  const [switchStatus, setSwitchStatus] = useState<'off' | 'on'>('off');
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#131416',
      }}>
      <StatusBar />
      <ScrollView>
        <CoverImage
          type="design"
          marginTop={116}
          handleNavigationPerson={() => navigation.navigate('Settings')}
          handleNavigationDevice={() => navigation.navigate('DeviceList')}>
          <View
            style={{
              marginTop: 76,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'center',
              width: Dimensions.get('window').width - 50,
              marginHorizontal: 25,
            }}>
            <Image
              source={require('../../assets/design.png')}
              style={{
                width: 80,
                height: 80,
                borderRadius: 0,
                marginRight: 15,
                marginLeft: 15,
              }}
            />
            <View
              style={{
                display: 'flex',
                flex: 1,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 32,
                    color: '#121115',
                  }}>
                  xxxxx，
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 32,
                    color: 'rgba(18,17,21,0.5)',
                    width: 32 * 7,
                  }}>
                  nice to
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 32,
                  color: 'rgba(18,17,21,0.5)',
                }}>
                see you!
              </Text>
            </View>
          </View>
        </CoverImage>
        <View
          style={{
            height: 193 / 2,
            borderRadius: 77 / 2,
            backgroundColor: 'rgba(52, 53, 54, 0.5)',
            // backgroundColor: 'red',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            marginTop: 28,
            marginHorizontal: 5,
          }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setSwitchStatus('off')}>
            <View
              style={{
                flex: 1,
                borderRadius: 77 / 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(switchStatus === 'off'
                  ? { backgroundColor: 'white' }
                  : { backgroundColor: '#767676' }),
              }}>
              <Text
                style={{
                  fontSize: 14,
                  ...(switchStatus === 'off'
                    ? { color: 'black', fontWeight: '600' }
                    : { color: '#ffffff' }),
                }}>
                Off
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setSwitchStatus('on')}>
            <View
              style={{
                flex: 1,
                marginLeft: 5,
                borderRadius: 77 / 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(switchStatus === 'on'
                  ? { backgroundColor: 'white' }
                  : { backgroundColor: '#767676' }),
              }}>
              <Text
                style={{
                  fontSize: 14,
                  ...(switchStatus === 'on'
                    ? { color: 'black', fontWeight: '600' }
                    : { color: '#ffffff' }),
                }}>
                On
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: 191 / 2,
            marginTop: 5,
            marginHorizontal: 5,
          }}>
          <TouchableOpacity
            style={{
              height: '100%',
              overflow: 'hidden',
              borderRadius: 30,
              flex: 1,
            }}
            onPress={() => navigation.navigate('LightList')}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(52, 53, 54, 0.3)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#ffffff',
                }}>
                My Effects
              </Text>
              <Image
                source={require('../../assets/design/love.png')}
                style={{ width: 122 / 2, height: 111 / 2, marginLeft: 16 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ScrollText')}
            style={{
              width: '33.149171%',
              height: '100%',
              overflow: 'hidden',
              borderRadius: 30,
              marginLeft: 3,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(52, 53, 54, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#ffffff',
                }}>
                Scrolling Text
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 5,
            marginHorizontal: 5,
          }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => navigation.navigate('EditLight')}>
            <View
              style={{
                height: 444 / 2,
                width: '100%',
                backgroundColor: 'rgba(52, 53, 54, 0.3)',
                borderRadius: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#ffffff',
                  marginBottom: 43 / 2,
                }}>
                Custom Design
              </Text>
              <Image
                source={require('../../assets/design/shan-dian.png')}
                style={{ width: 258 / 2, height: 228 / 2 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, marginLeft: 5 }}
            onPress={() => navigation.navigate('LightList')}>
            <View
              style={{
                height: 444 / 2,
                width: '100%',
                backgroundColor: 'rgba(52, 53, 54, 0.3)',
                borderRadius: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#ffffff',
                  marginBottom: 68 / 2,
                }}>
                Creative Patterns
              </Text>
              <Image
                source={require('../../assets/design/kun.png')}
                style={{ width: 178 / 2, height: 178 / 2 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
export default DesignScreen;
