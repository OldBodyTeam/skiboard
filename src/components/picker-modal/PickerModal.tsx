import React, {
  PropsWithChildren,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
// import { BlurView } from '@react-native-community/blur';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
const secondsList = Array(60)
  .fill(1)
  .map((_i, index) => {
    return { id: index < 10 ? '0' + index : index + '' };
  });

const AMHoursList = Array(12)
  .fill(1)
  .map((_i, index) => {
    return {
      id: index < 10 ? '0' + index : index + '',
    };
  });
export type PickerModalRef = {
  openModal: () => void;
  closeModal: () => void;
};
export type BlurModalProps = {
  type: 'AM' | 'PM';
  handleCurrentSelectedTime: () => void;
};
const PickerModal = forwardRef<
  PickerModalRef,
  PropsWithChildren<BlurModalProps>
>((props, ref) => {
  const { type, handleCurrentSelectedTime } = props;
  const [modalVisible, setModalVisible] = useState(false);
  useImperativeHandle(
    ref,
    () => {
      return {
        openModal: () => setModalVisible(true),
        closeModal: () => setModalVisible(false),
      };
    },
    [setModalVisible],
  );
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
        tint="systemThinMaterialDark"
        blurReductionFactor={10}
        experimentalBlurMethod="dimezisBlurView"
      />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: 420,
          borderRadius: 10,
          overflow: 'hidden',
          left: 0,
          bottom: 0,
        }}>
        <BlurView
          intensity={100}
          style={styles.blurContainer}
          tint="dark"
          blurReductionFactor={10}
          experimentalBlurMethod="dimezisBlurView">
          <View
            style={{
              backgroundColor: 'rgba(118, 118, 118, 0.4)',
              height: 4,
              borderRadius: 2,
              width: 40,
              marginTop: 8,
              marginBottom: 24,
            }}
          />
          <View
            style={{
              backgroundColor: 'rgba(118, 118, 118, 0.19)',
              height: 44,
              borderRadius: 14,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 4,
            }}>
            <View
              style={{
                height: 36,
                width: 45,
                backgroundColor: type === 'AM' ? '#25262B' : '',
                borderRadius: 9,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 19 / 2,
              }}>
              <Text>AM</Text>
            </View>
            <View
              style={{
                height: 36,
                width: 45,
                backgroundColor: type === 'PM' ? '#25262B' : '',
                borderRadius: 9,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text>PM</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              height: 78 * 3,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <View style={{ width: 76 }}>
              <FlatList
                data={AMHoursList}
                renderItem={({ item }) => {
                  return (
                    <View style={{ height: 78 }}>
                      <Text style={{ fontSize: 65, color: 'white' }}>
                        {item.id}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>

            <View
              style={{
                height: 78,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontSize: 65, color: 'white' }}>:</Text>
            </View>
            <View style={{ width: 76 }}>
              <FlatList
                data={secondsList}
                renderItem={({ item }) => {
                  return (
                    <View style={{ height: 78 }}>
                      <Text style={{ fontSize: 65, color: 'white' }}>
                        {item.id}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
          <Pressable onPress={handleCurrentSelectedTime}>
            <View
              style={{
                width: 106,
                height: 55,
                backgroundColor: 'white',
                borderRadius: 29,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontWeight: '600', color: '#333333' }}>Save</Text>
            </View>
          </Pressable>
        </BlurView>
      </View>
    </Modal>
  );
});
const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 10,
    textAlign: 'center',
    overflow: 'hidden',
    borderRadius: 20,
    alignItems: 'center',
  },
});
export default PickerModal;
