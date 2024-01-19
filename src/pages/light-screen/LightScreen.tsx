import CoverImage from '@components/cover-image/CoverImage';
import CustomThumb from '@components/custom-thumb/CustomThumb';
import Progress from '@components/progress/Progress';
import Switch from '@components/switch/Switch';
import React, { useState } from 'react';
import {
  StatusBar,
  ScrollView,
  View,
  TouchableNativeFeedbackBase,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import ColorPicker, { HueSlider } from 'reanimated-color-picker';

const LightScreen = (_props: any) => {
  const onSelectColor = ({ hex }: { hex: string }) => {
    // do something with the selected color.
    console.log(hex);
  };
  const [selected, setSelected] = useState(-1);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#131416',
      }}>
      <StatusBar />
      <ScrollView>
        <CoverImage type="light">
          <View style={{ marginTop: 137 / 2, marginLeft: 25 }}>
            <Text
              style={{ fontSize: 24, fontWeight: 'bold', color: '#121115' }}>
              Snowboard Light
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#121115',
                marginTop: 6,
              }}>
              Atmospheric Mode
            </Text>
          </View>
        </CoverImage>
        <View style={{ paddingHorizontal: 5 }}>
          <View style={{ flex: 1 }}>
            <ColorPicker value="red" onComplete={onSelectColor}>
              <HueSlider
                style={{ borderRadius: 60, marginBottom: 10 }}
                boundedThumb
                sliderThickness={60}
                thumbColor="#FFFFFF"
                renderThumb={CustomThumb}
              />
            </ColorPicker>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Progress />
            <Switch />
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              flex: 1,
            }}>
            {[
              '#FFFFFF',
              '#FACF00',
              '#00FEFC',
              '#FF8A5E',
              '#FF8A5E',
              '#60AEE6',
              '#60AEE6',
            ].map((color, index) => {
              return (
                <TouchableOpacity
                  onPress={() => setSelected(index)}
                  key={color + index}>
                  <View
                    style={{
                      width: 55,
                      height: 55,
                      borderColor: color,
                      borderRadius: 55,
                      backgroundColor: 'transparent',
                      borderWidth: selected === index ? 2 : 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: color,
                        borderRadius: 40,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }}>
          <TouchableOpacity style={{ flex: 1 }}>
            <View
              style={{
                height: 322 / 2,
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
                  marginBottom: 66 / 2,
                }}>
                LED Strips Effects
              </Text>
              <Image
                source={require('../../assets/music/led.png')}
                style={{ width: 140 / 2, height: 116 / 2 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, marginLeft: 5 }}>
            <View
              style={{
                height: 322 / 2,
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
                  marginBottom: 45 / 2,
                }}>
                Scenes
              </Text>
              <Image
                source={require('../../assets/music/scenes.png')}
                style={{ width: 138 / 2, height: 138 / 2 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
export default LightScreen;
