import Header from '@components/header/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { PropsWithChildren, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from 'route.config';
type ScenesTextProps = NativeStackScreenProps<RootStackParamList, 'Scenes'> &
  PropsWithChildren<{ name?: string }>;
const renderData = [
  { label: 'Party', icon: require('../../assets/scenes/party.png') },
  { label: 'Starry', icon: require('../../assets/scenes/starry.png') },
  { label: 'Birthday', icon: require('../../assets/scenes/birthday.png') },
  {
    label: 'Firworks',
    icon: require('../../assets/scenes/firworks.png'),
    selectIcon: require('../../assets/scenes/selected.png'),
  },
  { label: 'Christmas', icon: require('../../assets/scenes/christmas.png') },
  { label: 'Sunset', icon: require('../../assets/scenes/sunset.png') },
];
const Scenes = (props: ScenesTextProps) => {
  const { navigation } = props;
  const back = () => {
    navigation.navigate('Home', { screen: 'MusicScreen' });
  };
  const [selected, setSelected] = useState<
    (typeof renderData)[number]['label'] | undefined
  >();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(19, 20, 22, 1)',
        flexDirection: 'row',
      }}>
      <StatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Scenes" handlePress={back} />
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              marginHorizontal: 5 / 2,
              flex: 1,
              marginBottom: 5,
            }}>
            {renderData.map(item => {
              const icon =
                item.label !== 'Firworks'
                  ? item.icon
                  : selected === item.label
                  ? item.selectIcon
                  : item.icon;
              return (
                <TouchableOpacity
                  onPress={() => setSelected(item.label)}
                  key={item.label}
                  style={{
                    width: Math.floor(
                      (Dimensions.get('window').width - 15) / 2,
                    ),
                    height: 322 / 2,
                    borderRadius: 30,
                    backgroundColor:
                      selected === item.label
                        ? 'rgba(249, 221, 88, 1)'
                        : 'rgba(52, 53, 54, 0.3)',
                    margin: 5 / 2,
                    paddingTop: 58 / 2,
                    paddingBottom: 32 / 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingRight: 32 / 2,
                    transform:
                      selected === item.label ? [{ rotateZ: '-3deg' }] : [],
                  }}>
                  <Image
                    source={icon}
                    style={{
                      width: 116 / 2,
                      height: 116 / 2,
                      marginLeft: 58 / 2,
                    }}
                  />
                  <View
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: selected === item.label ? '#131416' : 'white',
                      }}>
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default Scenes;
