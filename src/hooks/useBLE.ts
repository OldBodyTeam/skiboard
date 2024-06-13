import { deviceInfoState } from '@stores/device/device.atom';
import { useMemoizedFn } from 'ahooks';
import { useRecoilState } from 'recoil';
import { Buffer } from 'buffer';
import BleManager from 'react-native-ble-manager';
import { BLEWriteLogger } from '@utils/log';
import Toast from 'react-native-root-toast';

const useBLE = () => {
  const [deviceInfo] = useRecoilState(deviceInfoState);
  const deviceId = deviceInfo.id;
  const deviceServiceUUID = deviceInfo.serviceUUIDs?.at(0)!;
  const deviceCharacteristicUUID = deviceInfo.characteristicUUIDs?.at(0)!;
  console.log(
    '正在读取id',
    deviceId,
    ' -- serviceUUIDs -- ',
    deviceInfo.serviceUUIDs,
    ' -- characteristicUUIDs -- ',
    deviceInfo.characteristicUUIDs,
  );
  // 获取电量
  const getBLEBatteryPower = useMemoizedFn(async () => {
    try {
      const readData = await BleManager.read(
        deviceId,
        deviceServiceUUID,
        deviceCharacteristicUUID,
      );
      console.log(readData);
      const buffer = Buffer.from(readData);
      console.log(buffer.toString('hex'));
      return buffer.toString('hex');
    } catch (error) {
      console.log('getBLEBatteryPower', (error as Error).message);
    }
  });
  // 写入
  const bleWrite = useMemoizedFn(async (data: string) => {
    const buffer = Buffer.from(data, 'hex');
    const bleData = buffer.toJSON().data;
    try {
      await BleManager.writeWithoutResponse(
        deviceId,
        deviceServiceUUID,
        deviceCharacteristicUUID,
        bleData,
      );
      BLEWriteLogger(data);
    } catch (error) {
      console.log('belWrite', (error as Error).message);
    }
  });
  // 检查是否连接中
  const checkBLEConnectStatus = useMemoizedFn(async () => {
    try {
      const data = await BleManager.getConnectedPeripherals([
        deviceCharacteristicUUID,
      ]);
      return !!data.length;
    } catch (error) {
      return false;
    }
  });
  if (!deviceId || !deviceCharacteristicUUID || !deviceServiceUUID) {
    Toast.show('当前无法连接蓝牙，请重试');
  }
  return __DEV__ || !deviceId || !deviceCharacteristicUUID || !deviceServiceUUID
    ? {
        getBLEBatteryPower: () => Promise.resolve('70'),
        bleWrite: () => Promise.resolve({}),
        checkBLEConnectStatus: () => Promise.resolve({}),
      }
    : { getBLEBatteryPower, bleWrite, checkBLEConnectStatus };
};
export default useBLE;
