import { sleep } from '@components/pick-time/PickTime';
import { butteryState, deviceInfoState } from '@stores/device/device.atom';
import { userInfoState } from '@stores/login/login.atom';
import { useMemoizedFn, useMount } from 'ahooks';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { get } from 'lodash';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import BleManager, {
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
// import { useRecoilState } from 'recoil';
const BleManagerModule = NativeModules.BleManager;
export const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const SECONDS_TO_SCAN_FOR = 0;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

const BackgroundBle: FC<PropsWithChildren<any>> = props => {
  const { children } = props;
  const [, setPeripherals] = useState(new Map<Peripheral['id'], Peripheral>());
  const [deviceInfo, setDeviceInfo] = useAtom(deviceInfoState);
  const setInfo = useSetAtom(butteryState);
  const userInfo = useAtomValue(userInfoState);
  const handleUpdateValueForCharacteristic = useMemoizedFn(
    async (data: BleManagerDidUpdateValueForCharacteristicEvent) => {
      await BleManager.startNotification(
        data.peripheral,
        data.service,
        data.characteristic,
      );
      const peripheralData = await BleManager.retrieveServices(data.peripheral);
      if (get(peripheralData, 'characteristics.0.value')) {
        const readData = get(peripheralData, 'characteristics.0.value', {
          bytes: [] as number[],
        });
        const decodedBytes = Buffer.from(readData.bytes);
        const code = decodedBytes.toString('hex');
        const decimalValue = parseInt(code.slice(-4, -2), 16);
        setInfo(decimalValue);
      } else {
        const decodedBytes = Buffer.from(data.value);
        const code = decodedBytes.toString('hex');
        const decimalValue = parseInt(code.slice(-4, -2), 16);
        setInfo(decimalValue);
      }
    },
  );

  const handleDisconnectedPeripheral = useMemoizedFn(async args => {
    console.log('BleManagerDisconnectPeripheral', args);
    setDeviceInfo(prev => {
      return {
        ...prev,
        connected: false,
      };
    });
    const peripheral = get(args, 'peripheral', '');
    if (peripheral) {
      const isConnected = await BleManager.isPeripheralConnected(peripheral);
      if (isConnected) {
        await BleManager.connect(peripheral);
      } else {
        await BleManager.scan(
          SERVICE_UUIDS,
          SECONDS_TO_SCAN_FOR,
          ALLOW_DUPLICATES,
          {
            matchMode: BleScanMatchMode.Sticky,
            scanMode: BleScanMode.LowLatency,
            callbackType: BleScanCallbackType.AllMatches,
          },
        );
      }
    } else {
      await BleManager.scan(
        SERVICE_UUIDS,
        SECONDS_TO_SCAN_FOR,
        ALLOW_DUPLICATES,
        {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        },
      );
    }
  });
  // const handleStopScan = useMemoizedFn(args => {
  //   console.log('BleManagerStopScan', args);
  // });

  const handleDiscoverPeripheral = useMemoizedFn(
    async (peripheral: Peripheral) => {
      console.log('bg -------------> ^ - ^', peripheral);
      if (peripheral.name?.startsWith('Lumii') && peripheral.id) {
        setPeripherals(map => {
          return new Map(map.set(peripheral.id, peripheral));
        });
        await BleManager.stopScan();
        await BleManager.connect(peripheral.id);
        await sleep(900);
        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        await sleep(900);
        const serviceUUIDs = peripheralData.characteristics?.map(
          v => v.service,
        );
        const characteristicUUIDs = peripheralData.characteristics?.map(
          v => v.characteristic,
        );
        const rssi = await BleManager.readRSSI(peripheral.id);
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.rssi = rssi;
            p.serviceUUIDs = serviceUUIDs;
            p.characteristicUUIDs = characteristicUUIDs;
            return new Map(map.set(p.id, p));
          }
          return map;
        });
        setDeviceInfo({
          ...peripheral,
          serviceUUIDs: serviceUUIDs,
          characteristicUUIDs: characteristicUUIDs,
          connected: true,
        });
        await handleUpdateValueForCharacteristic({
          peripheral: peripheral.id,
          service: serviceUUIDs?.at(0)!,
          characteristic: characteristicUUIDs?.at(0)!,
          value: [],
        });
        // const decodedBytes = Buffer.from(readData);
        // // Step 2: 将字节数组转换为十六进制字符串
        // const hexString = decodedBytes;
        // console.log('解析后的二进制数值:', hexString);
        // // Step 3: 将十六进制字符串解析为十进制数值
        // const decimalValue = parseInt(hexString, 10);
        // console.log('解析后的十进制数值:', decimalValue);
      }
    },
  );
  useEffect(() => {
    console.log('BackgroundBle useMount');
    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      // bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      ),
      // bleManagerEmitter.addListener(
      //   'BleManagerDidUpdateValueForCharacteristic',
      //   handleUpdateValueForCharacteristic,
      // ),
    ];

    return () => {
      console.log('BackgroundBle unmount');
      for (const listener of listeners) {
        listener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('BackgroundBle useEffect', deviceInfo, userInfo);
    if (!deviceInfo.id && userInfo) {
      BleManager.start({ showAlert: false })
        .then(() => {
          console.log('Module initialized');
          // Start scanning
          return BleManager.scan(
            SERVICE_UUIDS,
            SECONDS_TO_SCAN_FOR,
            ALLOW_DUPLICATES,
            {
              matchMode: BleScanMatchMode.Sticky,
              scanMode: BleScanMode.LowLatency,
              callbackType: BleScanCallbackType.AllMatches,
            },
          );
        })
        .catch(err => {
          console.error('Error starting BLE manager:', err);
        });
    }
  }, [deviceInfo, userInfo]);

  return <>{children}</>;
};
export default BackgroundBle;
