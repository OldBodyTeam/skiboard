import React, { useState } from 'react';
import { Button, Modal, StyleSheet, View } from 'react-native';

import ColorPicker, {
  Panel1,
  Panel3,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from 'reanimated-color-picker';
import MyCustomThumb from './a';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});
const ColorPickerPage = () => {
  const [showModal, setShowModal] = useState(false);

  const onSelectColor = ({ hex }) => {
    // do something with the selected color.
    console.log(hex);
  };

  return (
    <View style={styles.container}>
      <ColorPicker
        value="red"
        onComplete={onSelectColor}>
        {/* <Preview />
        <Panel1
          style={{ height: 60,borderRadius: 60, marginBottom: 10 }}
          boundedThumb

        /> */}
        <HueSlider
          style={{ borderRadius: 60, marginBottom: 10 }}
          boundedThumb
          sliderThickness={60}
          // thumbStyle={{marginTop: 0, opacity: 1, borderWidth: 10}}
          thumbColor="#FFFFFF"
          renderThumb={MyCustomThumb}
        />
        {/* <OpacitySlider />
        <Swatches /> */}
      </ColorPicker>
    </View>
  );
};
export default ColorPickerPage;
