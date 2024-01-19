import React, { useEffect, useState } from 'react';
import { BlurView } from '@react-native-community/blur';
import { Modal, StyleSheet, Text, View } from 'react-native';
import {
  DateTimePicker,
  Picker,
  ThemeManager,
  WheelPicker,
  Colors,
} from 'react-native-ui-lib';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
const options = [
  { label: 'JavaScript', value: 'js' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
  { label: 'C++', value: 'c++', disabled: true },
  { label: 'Perl', value: 'perl' },
];
// Colors.loadColors({
//   primaryColor: {

//   }
// })
const PickerModal = () => {
  const [modalVisible, setModalVisible] = useState(true);
  useEffect(() => {
    ThemeManager.setComponentForcedTheme('WheelPicker', props => {
      console.log(props);
      return {};
    });
  }, []);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <BlurView
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
        blurAmount={10}
      />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: 350,
          borderRadius: 10,
          overflow: 'hidden',
          left: 0,
          bottom: 0,
        }}>
        <BlurView
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}
          blurAmount={32}
          blurRadius={10}
        />
        <GestureHandlerRootView
          style={{
            flex: 1,
            backgroundColor: 'red',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* <Picker
            placeholder="Favorite Languages (up to 3)"
            // value={this.state.languages}
            // onChange={items => this.setState({ languages: items })}
            mode={Picker.modes.MULTI}
            selectionLimit={3}
            useWheelPicker
            // trailingAccessory={dropdownIcon}>
          >
            {options.map(option => (
              <Picker.Item
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={option.disabled}
              />
            ))}
          </Picker> */}
          <WheelPicker
            items={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
              { label: 'Maybe', value: 'maybe' },
            ]}
            initialValue={'yes'}
            onChange={() => console.log('changed')}
            // label={'Days'}
            style={{ backgroundColor: 'transparent', flex: 1 }}
            faderProps={{ tintColor: 'transparent' }}
            // separatorsStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}
            textStyle={{ fontSize: 40 }}
            activeTextColor="#ffffff"
            itemHeight={78}
            numberOfVisibleRows={3}
            inactiveTextColor="#ffffff"
          />
        </GestureHandlerRootView>
      </View>
    </Modal>
  );
};
export default PickerModal;
