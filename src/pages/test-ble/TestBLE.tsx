import React, { useState } from 'react';
import {
  Button,
  FlatList,
  View,
  Text,
  ScrollView,
  TextInput,
} from 'react-native';
import { BLE, BLEService } from './BLEService';
import { Device } from 'react-native-ble-plx';
import { cloneDeep } from 'lodash';
import Toast from 'react-native-toast-message';
import { BleDevice, DropDown, StyledText } from './BleDevice';
import { ThemeProvider } from 'styled-components';
import { commonTheme } from './theme/theme';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Footer from './Footer';
import base64 from 'react-native-base64';
type DeviceExtendedByUpdateTime = Device & { updateTimestamp: number };
const MIN_TIME_BEFORE_UPDATE_IN_MILLISECONDS = 5000;
const TestBLE = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [foundDevices, setFoundDevices] = useState<
    DeviceExtendedByUpdateTime[]
  >([]);
  const isFoundDeviceUpdateNecessary = (
    currentDevices: DeviceExtendedByUpdateTime[],
    updatedDevice: Device,
  ) => {
    const currentDevice = currentDevices.find(
      ({ id }) => updatedDevice.id === id,
    );
    if (!currentDevice) {
      return true;
    }
    return currentDevice.updateTimestamp < Date.now();
  };
  const addFoundDevice = (device: Device) => {
    if (
      device.name?.startsWith('Wagli') ||
      device.localName?.startsWith('Wagli')
    ) {
      setFoundDevices(prevState => {
        if (!isFoundDeviceUpdateNecessary(prevState, device)) {
          return prevState;
        }
        // deep clone
        const nextState = cloneDeep(prevState);
        const extendedDevice: DeviceExtendedByUpdateTime = {
          ...device,
          updateTimestamp: Date.now() + MIN_TIME_BEFORE_UPDATE_IN_MILLISECONDS,
        } as DeviceExtendedByUpdateTime;

        const indexToReplace = nextState.findIndex(
          currentDevice => currentDevice.id === device.id,
        );
        if (indexToReplace === -1) {
          return nextState.concat(extendedDevice);
        }
        nextState[indexToReplace] = extendedDevice;
        return nextState;
      });
    }
  };
  const handleScan = () => {
    setFoundDevices([]);
    BLEService.initializeBLE().then(() =>
      BLEService.scanDevices(addFoundDevice, null, true),
    );
  };
  const [info, setInfo] = useState<Device>();
  const fetchServicesAndCharacteristicsForDevice = async (device: Device) => {
    var servicesMap = {} as Record<string, any>;
    var services = await device.services();

    for (let service of services) {
      var characteristicsMap = {} as Record<string, any>;
      var characteristics = await service.characteristics();

      for (let characteristic of characteristics) {
        characteristicsMap[characteristic.uuid] = {
          uuid: characteristic.uuid,
          isReadable: characteristic.isReadable,
          isWritableWithResponse: characteristic.isWritableWithResponse,
          isWritableWithoutResponse: characteristic.isWritableWithoutResponse,
          isNotifiable: characteristic.isNotifiable,
          isNotifying: characteristic.isNotifying,
          value: characteristic.value,
        };
      }

      servicesMap[service.uuid] = {
        uuid: service.uuid,
        isPrimary: service.isPrimary,
        characteristicsCount: characteristics.length,
        characteristics: characteristicsMap,
      };
    }
    return servicesMap;
  };
  // 蓝牙是否连接
  const [isConnected, setIsConnected] = useState(false);
  const onConnectSuccess = async (device: Device): Promise<void> => {
    return new Promise((resolve, reject) => {
      setInfo(device);
      setIsConnecting(false);
      setIsConnected(true);
      resolve();
      // device
      //   .discoverAllServicesAndCharacteristics()
      //   // eslint-disable-next-line @typescript-eslint/no-shadow
      //   .then(device => {
      //     console.log('Services and characteristics discovered');
      //     return fetchServicesAndCharacteristicsForDevice(device);
      //   })
      //   .then(services => {
      //     console.log('fetchServicesAndCharacteristicsForDevice', services);
      //     BLE.getUUID(services);
      //     setIsConnected(true);

      //     resolve();
      //   })
      //   .catch(err => {
      //     console.log('connect fail: ', err);
      //     reject(err);
      //   });
    });
  };

  const onConnectFail = () => {
    setIsConnecting(false);
  };
  const deviceRender = (device: Device) => {
    return (
      <BleDevice
        onPress={pickedDevice => {
          console.log('*********************');
          setIsConnecting(true);
          BLE.connect(pickedDevice.id)
            .then(onConnectSuccess)
            .catch(onConnectFail);
        }}
        key={device.id}
        device={device}
      />
    );
  };
  const [testData, setTestData] = useState<string>();
  const handleSendData = () => {
    BLEService.discoverAllServicesAndCharacteristicsForDevice().then(device => {
      console.log(device.overflowServiceUUIDs);
      console.log(device?.serviceUUIDs);
    });
    BLEService.writeCharacteristicWithResponseForDevice();
  };

  console.log(isConnected);

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={commonTheme}>
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
          {isConnecting && (
            <DropDown>
              <StyledText style={{ fontSize: 30 }}>Connecting</StyledText>
            </DropDown>
          )}
          <Text>{base64.encode('1')}</Text>
          <Button title="扫描蓝牙" onPress={handleScan} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 12,
              borderWidth: 1,
              borderColor: 'red',
              borderRadius: 4,
              padding: 8,
            }}>
            <Text>
              蓝牙连接当前设备：{info?.name ?? '暂无设备'} 状态:{' '}
              {info?.isConnected ? '已连接' : '未连接'}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>请输入测试数据</Text>
            <TextInput
              style={{
                height: 40,
                borderWidth: 1,
                padding: 10,
                marginVertical: 6,
                width: '100%',
                borderColor: 'red',
                borderRadius: 4,
              }}
              value={testData}
              onChangeText={setTestData}
            />
            <Button title="点击发送" onPress={handleSendData} />
          </View>
          <Footer isConnected={isConnected} />
          <FlatList
            data={foundDevices}
            renderItem={({ item }) => deviceRender(item)}
            keyExtractor={device => device.id}
          />
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default TestBLE;
