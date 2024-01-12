import React, { FC, useRef, useState } from 'react';
import { Text, TouchableHighlight, View, Image, TextInput } from 'react-native';
import BlurModal, { BlurModalRef } from '@components/blur-Modal/BlurModal';
export type DeviceListItemProps = {
  device: any;
};
const DeviceListItem: FC<DeviceListItemProps> = _props => {
  //   const { device, handleConnectDevice } = props;
  const [selectedDevice, setSelectedDevice] = useState<boolean>(false);
  const handleConnectDevice = () => {
    //处理蓝牙连接 数据共享
    setSelectedDevice(prev => !prev);
  };
  const modalDeleteRef = useRef<BlurModalRef>(null);
  const modalEditRef = useRef<BlurModalRef>(null);
  const handleEdit = () => {
    console.log('edit');
    modalEditRef.current?.closeModal();
  };
  const handleDelete = () => {
    console.log('delete');
    modalEditRef.current?.closeModal();
  };

  return (
    <>
      <TouchableHighlight onPress={handleConnectDevice}>
        <View
          style={{
            margin: 8,
            height: 80.5,
            borderRadius: 10,
            backgroundColor: selectedDevice ? '#FFE400' : '#262626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 20,
            flexDirection: 'row',
          }}>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: 40.5,
                height: 40.5,
                borderRadius: 40.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selectedDevice
                  ? 'rgba(38,42,46,1)'
                  : 'rgba(225,225,255,0.3)',
                position: 'relative',
              }}>
              <Image
                source={
                  selectedDevice
                    ? require('../../assets/device/connected.png')
                    : require('../../assets/device/connect.png')
                }
                style={{ width: 22.5, height: 22.5 }}
              />
              <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                <Image
                  source={
                    selectedDevice
                      ? require('../../assets/device/bluetoothed.png')
                      : require('../../assets/device/bluetooth.png')
                  }
                  style={{ width: 16, height: 16 }}
                />
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginLeft: 12,
              }}>
              <Text
                style={{
                  fontWeight: '700',
                  color: selectedDevice ? '#000000' : '#ffffff',
                  fontSize: 15,
                  marginBottom: 9,
                }}>
                111
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={
                    selectedDevice
                      ? require('../../assets/device/batteryed.png')
                      : require('../../assets/device/battery.png')
                  }
                />
                <Text
                  style={{
                    fontWeight: '400',
                    fontSize: 12,
                    color: '#5B5100',
                    marginLeft: 4,
                  }}>
                  99%
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TouchableHighlight
              onPress={() => modalEditRef.current?.openModal()}>
              <Image
                source={
                  !selectedDevice
                    ? require('../../assets/device/edited.png')
                    : require('../../assets/device/edit.png')
                }
                style={{ width: 22, height: 22 }}
              />
            </TouchableHighlight>
            <TouchableHighlight
              style={{ marginLeft: 20 }}
              onPress={() => modalDeleteRef.current?.openModal()}>
              <Image
                source={
                  !selectedDevice
                    ? require('../../assets/device/deleted.png')
                    : require('../../assets/device/delete.png')
                }
                style={{ width: 22, height: 22 }}
              />
            </TouchableHighlight>
          </View>
        </View>
      </TouchableHighlight>
      <BlurModal
        ref={modalDeleteRef}
        title="Remove Device"
        content="Confirm device removal">
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 12 }}>
          <TouchableHighlight
            style={{ flex: 1 }}
            onPress={() => modalDeleteRef.current?.closeModal()}>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
              }}>
              <Text
                style={{ fontWeight: 'bold', fontSize: 16, color: '#ffffff' }}>
                Cancel
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={{ flex: 1 }} onPress={handleDelete}>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
              }}>
              <Text
                style={{ color: '#FCE500', fontWeight: 'bold', fontSize: 16 }}>
                Confirm
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </BlurModal>
      <BlurModal ref={modalEditRef} title="Rename" content="Change Device Name">
        <View style={{ display: 'flex', marginTop: 8, width: '100%' }}>
          <View style={{ paddingLeft: 21, paddingRight: 21, width: '100%' }}>
            <TextInput
              placeholder="Enter device name"
              style={{
                height: 36,
                backgroundColor: '#262626',
                borderRadius: 8,
                width: '100%',
                paddingLeft: 12,
                paddingRight: 12,
                color: 'white',
              }}
            />
          </View>
          <TouchableHighlight
            style={{ flex: 1, marginTop: 12 }}
            onPress={handleEdit}>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
              }}>
              <Text
                style={{ color: '#FCE500', fontWeight: 'bold', fontSize: 16 }}>
                Confirm
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </BlurModal>
    </>
  );
};
export default DeviceListItem;
