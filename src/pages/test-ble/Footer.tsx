import React, { FC, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { BLE } from './BLEService';
import Characteristic from './Characteristic';
import { Subscription } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
export type FooterType = {
  isConnected?: boolean;
};
export function alert(text: string) {
  Alert.alert('提示', text, [{ text: '确定', onPress: () => {} }]);
}
const Footer: FC<FooterType> = ({ isConnected }) => {
  // 写数据
  const [writeData, setWriteData] = useState('');
  // 接收到的数据
  const [receiveData, setReceiveData] = useState('');
  // 读取的数据
  const [readData, setReadData] = useState('');
  // 输入的内容
  const [inputText, setInputText] = useState('');
  // 蓝牙是否正在监听
  const [isMonitoring, setIsMonitoring] = useState(false);
  /** 蓝牙接收的数据缓存 */
  const bleReceiveData = useRef<any[]>([]);
  const monitorListener = useRef<Subscription>();
  function write(writeType: 'write' | 'writeWithoutResponse') {
    return (index: number) => {
      if (inputText.length === 0) {
        alert('请输入消息内容');
        return;
      }

      console.log('*********** index --->', index, inputText);

      BLE[writeType](inputText, index)
        .then((c: any) => {
          console.log('&&&&&&&&&&');
          console.log(c);
          bleReceiveData.current = [];
          setWriteData(inputText);
          setInputText('');
        })
        .catch(() => {
          alert('发送失败');
        });
    };
  }
  function read(index: number) {
    BLE.read(index)
      .then((value: any) => {
        setReadData(value);
      })
      .catch(() => {});
  }
  /** 监听蓝牙数据 */
  function monitor(index: number) {
    monitorListener.current = BLE.manager.monitorCharacteristicForDevice(
      BLE.peripheralId,
      BLE.nofityServiceUUID[index],
      BLE.nofityCharacteristicUUID[index],
      (error, characteristic) => {
        if (error) {
          setIsMonitoring(false);
          console.log('monitor fail:', error);
          alert('monitor fail: ' + error.reason);
        } else {
          setIsMonitoring(false);
          bleReceiveData.current.push(characteristic!.value); //数据量多的话会分多次接收
          setReceiveData(bleReceiveData.current.join(''));
          console.log(
            'monitor success',
            characteristic!.value,
            base64.decode(characteristic!.value as string),
          );
        }
      },
    );
  }
  if (!isConnected) {
    return;
  }

  return (
    <>
      <Characteristic
        label="写数据（write）："
        action="发送"
        content={writeData}
        characteristics={BLE.writeWithResponseCharacteristicUUID}
        onPress={write('write')}
        input={{ inputText, setInputText }}
      />

      <Characteristic
        label="写数据（writeWithoutResponse）："
        action="发送"
        content={writeData}
        characteristics={BLE.writeWithoutResponseCharacteristicUUID}
        onPress={write('writeWithoutResponse')}
        input={{ inputText, setInputText }}
      />

      <Characteristic
        label="读取的数据："
        action="读取"
        content={readData}
        characteristics={BLE.readCharacteristicUUID}
        onPress={read}
      />

      <Characteristic
        label={`通知监听接收的数据（${
          isMonitoring ? '监听已开启' : '监听未开启'
        }）：`}
        action="开启监听"
        content={receiveData}
        characteristics={BLE.nofityCharacteristicUUID}
        onPress={monitor}
      />
    </>
  );
};
export default Footer;
