import CoverImage from '@components/cover-image/CoverImage';
import React from 'react';
import { SafeAreaView, StatusBar, ScrollView, View } from 'react-native';

const LightScreen = (_props: any) => {
  //   console.log(props);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#131416',
      }}>
      <StatusBar />
      <ScrollView>
        <CoverImage type="light" />
      </ScrollView>
    </View>
  );
};
export default LightScreen;
