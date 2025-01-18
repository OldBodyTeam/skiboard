import { deviceInfoState } from '@stores/device/device.atom';
import { useMemoizedFn } from 'ahooks';
import { useRecoilState } from 'recoil';
import { Buffer } from 'buffer';
import BleManager from 'react-native-ble-manager';
import { BLEWriteLogger } from '@utils/log';
import Toast from 'react-native-root-toast';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';

const useBLE = () => {
  const [deviceInfo] = useRecoilState(deviceInfoState);
  const deviceId = deviceInfo.id;
  const deviceServiceUUID = deviceInfo.serviceUUIDs?.at(0)!;
  const deviceCharacteristicUUID = deviceInfo.characteristicUUIDs?.at(0)!;
  // console.log(
  //   '正在读取id',
  //   deviceId,
  //   ' -- serviceUUIDs -- ',
  //   deviceInfo.serviceUUIDs,
  //   ' -- characteristicUUIDs -- ',
  //   deviceInfo.characteristicUUIDs,
  // );
  // const [, setInfo] = useRecoilState(butteryState);

  // 获取电量
  const getBLEBatteryPower = useMemoizedFn(async () => {
    try {
      await BleManager.startNotification(
        deviceInfo.id,
        deviceInfo.serviceUUIDs!.at(0)!,
        deviceInfo.characteristicUUIDs!.at(0)!,
      );
      const peripheralData = await BleManager.retrieveServices(deviceInfo.id);
      const readData = get(peripheralData, 'characteristics.0.value', {
        bytes: [] as number[],
      });
      const decodedBytes = Buffer.from(readData.bytes);
      const code = decodedBytes.toString('hex');
      const decimalValue = parseInt(code.slice(-4, -2), 16);
      return decimalValue;
    } catch (error) {
      console.log('getBLEBatteryPower', (error as Error).message);
    }
  });
  const { t } = useTranslation();
  // 写入
  const bleWrite = useMemoizedFn(async (data: string) => {
    BleManager.isPeripheralConnected(deviceId)
      .then(async res => {
        try {
          if (!res) {
            // Toast.show('蓝牙需要连接');
            await BleManager.connect(deviceId);
            Toast.show(t('reconnect'));
          }
          // else {
          //   Toast.show('暂无蓝牙设备，请打开蓝牙后使用', {
          //     position: Toast.positions.CENTER,
          //   });
          //   return;
          // }
          // const maxLength =
          //   await BleManager.getMaximumWriteValueLengthForWithoutResponse(
          //     deviceId,
          //   );
          // console.log(maxLength);
          // await BleManager.requestMTU(deviceId, maxLength);
          const decimalValue = (await getBLEBatteryPower()) ?? {};
          console.log('decimalValue', decimalValue);
          // setInfo(decimalValue ?? 0);
          const buffer = Buffer.from(data, 'hex');
          const bleData = buffer.toJSON().data;
          Toast.show(`蓝牙开始写入${data}`);
          await BleManager.writeWithoutResponse(
            deviceId,
            deviceServiceUUID,
            deviceCharacteristicUUID,
            bleData,
            512 - 3,
          );

          BLEWriteLogger(data);
        } catch (error) {
          Toast.show('暂无蓝牙设备，请打开蓝牙后使用', {
            position: Toast.positions.CENTER,
          });
          console.log('belWrite', (error as Error).message);
        }
      })
      .catch();
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
    __DEV__ ? undefined : Toast.show('当前无法连接蓝牙，请重试');
  }
  // return __DEV__
  //   ? {
  //       getBLEBatteryPower: () => Promise.resolve('70'),
  //       bleWrite: (data: any) => {
  //         console.log(data);
  //         Promise.resolve({});
  //       },
  //       checkBLEConnectStatus: () => Promise.resolve({}),
  //     }
  //   : { getBLEBatteryPower, bleWrite, checkBLEConnectStatus };
  return { getBLEBatteryPower, bleWrite, checkBLEConnectStatus };
};
export default useBLE;
