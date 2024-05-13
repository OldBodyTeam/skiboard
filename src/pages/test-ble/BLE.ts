import { BleManager, Characteristic, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

import { Alert } from 'react-native';
import base64 from 'react-native-base64';

/** 字符串转换成byte数组 */
export function stringToByte(str: string) {
  var bytes = [];
  var len, c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  return bytes;
}

/** byte数组转换成字符串 */
export function byteToString(arr: any) {
  if (typeof arr === 'string') {
    return arr;
  }
  var str = '',
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}

export function alert(text: string) {
  Alert.alert('提示', text, [{ text: '确定', onPress: () => {} }]);
}

export default class BleModule {
  peripheralId!: string;
  manager: BleManager;

  readServiceUUID!: any[];
  readCharacteristicUUID!: any[];
  writeWithResponseServiceUUID!: any[];
  writeWithResponseCharacteristicUUID!: any[];
  writeWithoutResponseServiceUUID!: any[];
  writeWithoutResponseCharacteristicUUID!: any[];
  nofityServiceUUID!: any[];
  nofityCharacteristicUUID!: any[];

  constructor(manager: BleManager) {
    this.manager = manager;
    this.initUUID();
  }

  /** 获取蓝牙UUID */
  async fetchServicesAndCharacteristicsForDevice(device: Device) {
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
  }

  initUUID() {
    this.readServiceUUID = [];
    this.readCharacteristicUUID = [];
    this.writeWithResponseServiceUUID = [];
    this.writeWithResponseCharacteristicUUID = [];
    this.writeWithoutResponseServiceUUID = [];
    this.writeWithoutResponseCharacteristicUUID = [];
    this.nofityServiceUUID = [];
    this.nofityCharacteristicUUID = [];
  }

  /** 获取Notify、Read、Write、WriteWithoutResponse的serviceUUID和characteristicUUID */
  getUUID(services: any) {
    this.readServiceUUID = [];
    this.readCharacteristicUUID = [];
    this.writeWithResponseServiceUUID = [];
    this.writeWithResponseCharacteristicUUID = [];
    this.writeWithoutResponseServiceUUID = [];
    this.writeWithoutResponseCharacteristicUUID = [];
    this.nofityServiceUUID = [];
    this.nofityCharacteristicUUID = [];

    for (let i in services) {
      // console.log('service',services[i]);
      let charchteristic = services[i].characteristics;
      for (let j in charchteristic) {
        // console.log('charchteristic',charchteristic[j]);
        if (charchteristic[j].isReadable) {
          this.readServiceUUID.push(services[i].uuid);
          this.readCharacteristicUUID.push(charchteristic[j].uuid);
        }
        if (charchteristic[j].isWritableWithResponse) {
          this.writeWithResponseServiceUUID.push(services[i].uuid);
          this.writeWithResponseCharacteristicUUID.push(charchteristic[j].uuid);
        }
        if (charchteristic[j].isWritableWithoutResponse) {
          this.writeWithoutResponseServiceUUID.push(services[i].uuid);
          this.writeWithoutResponseCharacteristicUUID.push(
            charchteristic[j].uuid,
          );
        }
        if (charchteristic[j].isNotifiable) {
          this.nofityServiceUUID.push(services[i].uuid);
          this.nofityCharacteristicUUID.push(charchteristic[j].uuid);
        }
      }
    }

    console.log('readServiceUUID', this.readServiceUUID);
    console.log('readCharacteristicUUID', this.readCharacteristicUUID);
    console.log(
      'writeWithResponseServiceUUID',
      this.writeWithResponseServiceUUID,
    );
    console.log(
      'writeWithResponseCharacteristicUUID',
      this.writeWithResponseCharacteristicUUID,
    );
    console.log(
      'writeWithoutResponseServiceUUID',
      this.writeWithoutResponseServiceUUID,
    );
    console.log(
      'writeWithoutResponseCharacteristicUUID',
      this.writeWithoutResponseCharacteristicUUID,
    );
    console.log('nofityServiceUUID', this.nofityServiceUUID);
    console.log('nofityCharacteristicUUID', this.nofityCharacteristicUUID);
  }

  /** 停止搜索蓝牙 */
  stopScan() {
    this.manager.stopDeviceScan();
  }

  /** 连接蓝牙 */
  connect(id: string): Promise<Device> {
    return new Promise((resolve, reject) => {
      let currentDevice: Device | null = null;
      this.manager
        .connectToDevice(id)
        .then(device => {
          console.log('connect success:', device.name, device.id);
          this.peripheralId = device.id;
          currentDevice = device;
          return device.discoverAllServicesAndCharacteristics();
        })
        .then(device => {
          return this.fetchServicesAndCharacteristicsForDevice(device);
        })
        .then(services => {
          console.log('fetchServicesAndCharacteristicsForDevice', services);
          this.getUUID(services);
          resolve(currentDevice!);
        })
        .catch(err => {
          console.log('connect fail: ', err);
          reject(err);
        });
    });
  }

  /** 断开蓝牙 */
  disconnect() {
    this.manager
      .cancelDeviceConnection(this.peripheralId)
      .then(res => {
        console.log('disconnect success', res);
      })
      .catch(err => {
        console.log('disconnect fail', err);
      });
  }

  /** 读取数据 */
  read(index: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.manager
        .readCharacteristicForDevice(
          this.peripheralId,
          this.readServiceUUID[index],
          this.readCharacteristicUUID[index],
        )
        .then(
          characteristic => {
            let buffer = Buffer.from(characteristic.value!, 'base64');
            // let value = buffer.toString();
            const value = byteToString(buffer);
            console.log('read success', buffer, value);
            resolve(value);
          },
          error => {
            console.log('read fail: ', error);
            alert('read fail: ' + error.reason);
            reject(error);
          },
        );
    });
  }

  /** 写数据 */
  write(value: string, index: number): Promise<Characteristic> {
    let formatValue: any;
    console.log('&&&&&&', value);
    if (value === '0D0A') {
      //直接发送小票打印机的结束标志
      formatValue = value;
    } else {
      //发送内容，转换成base64编码
      formatValue = new Buffer(value, 'base64').toString('ascii');
      console.log('********* formatValue --->', formatValue);
      console.log(
        '********* this.writeWithResponseServiceUUID[index] --->',
        this.writeWithResponseServiceUUID[index],
      );
      console.log(
        '*********  this.writeWithResponseCharacteristicUUID[index] --->',
        this.writeWithResponseCharacteristicUUID[index],
      );
    }
    return new Promise((resolve, reject) => {
      this.manager
        .writeCharacteristicWithResponseForDevice(
          this.peripheralId,
          this.writeWithResponseServiceUUID[index],
          this.writeWithResponseCharacteristicUUID[index],
          formatValue,
        )
        .then(
          characteristic => {
            console.log('write success', value);
            resolve(characteristic);
          },
          error => {
            console.log('write fail: ', error);
            alert('write fail');
            reject(error);
          },
        );
    });
  }

  /** 写数据 withoutResponse */
  writeWithoutResponse(value: string, index: number): Promise<Characteristic> {
    let formatValue: any;
    if (value === '0D0A') {
      //直接发送小票打印机的结束标志
      formatValue = value;
    } else {
      //发送内容，转换成base64编码
      formatValue = base64.encode(value);
      const formatValue1 = new Buffer(value, 'base64').toString('ascii');
      console.log('********* formatValue --->', formatValue);
      console.log('********* formatValue --->', formatValue1);
      console.log('********* formatValue --->', this.peripheralId);
      console.log(
        '********* this.writeWithoutResponseServiceUUID[index] --->',
        this.writeWithoutResponseServiceUUID,
      );
      console.log(
        '*********  this.writeWithoutResponseCharacteristicUUID[index] --->',
        this.writeWithoutResponseCharacteristicUUID,
      );
    }
    return new Promise((resolve, reject) => {
      this.manager
        .writeCharacteristicWithoutResponseForDevice(
          this.peripheralId,
          this.writeWithoutResponseServiceUUID[index],
          this.writeWithoutResponseCharacteristicUUID[index],
          formatValue,
        )
        .then(
          characteristic => {
            console.log('writeWithoutResponse success', value);
            resolve(characteristic);
          },
          error => {
            console.log('writeWithoutResponse fail: ', error);
            alert('writeWithoutResponse fail');
            reject(error);
          },
        );
    });
  }

  /** 卸载蓝牙管理器 */
  destroy() {
    console.log('destroy');
    this.manager.destroy();
  }
}
