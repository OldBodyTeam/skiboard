import { useScreenSize } from '@hooks/useScreenSize';
import { BlurView } from '@react-native-community/blur';
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  PropsWithChildren,
} from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
export type BlurModalProps = {
  title?: string;
  content?: string;
  mode?: 'dark' | 'light';
};
export type BlurModalRef = {
  openModal: () => void;
  closeModal: () => void;
};
const BlurModal = forwardRef<BlurModalRef, PropsWithChildren<BlurModalProps>>(
  (props, ref) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { title, content, children, mode = 'dark' } = props;
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
    const { width, height } = useScreenSize();
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <BlurView
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />
        <View
          style={{
            backgroundColor: mode === 'light' ? 'white' : '#5A5A5A',
            width: width - 105,
            borderRadius: 7,
            marginTop: (height - 140) / 2,
            position: 'absolute',
            marginLeft: 105 / 2,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
          <Text
            style={{
              color: mode === 'light' ? 'rgba(0, 0, 0, 1)' : '#white',
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 24,
            }}>
            {title}
          </Text>
          <Text
            style={{
              color: mode === 'light' ? 'rgba(0, 0, 0, 0.4)' : '#C5C5C5',
              fontSize: 15,
              fontWeight: '400',
              marginTop: 12,
            }}>
            {content}
          </Text>
          {children}
        </View>
      </Modal>
    );
  },
);
export default BlurModal;
