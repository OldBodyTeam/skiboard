/**
 * Sample BLE React Native App
 */

import React, { useState, useEffect, FC } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  TouchableHighlight,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';
import { useDebounceFn, useMemoizedFn, useMount } from 'ahooks';
import { useRecoilState } from 'recoil';
import videoMp4 from './connected.mp4';
import { butteryState, deviceInfoState } from '@stores/device/device.atom';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'route.config';
import { getI18n, useTranslation } from 'react-i18next';
import { Logger } from '@utils/log';
import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import Toast from 'react-native-root-toast';
import LottieView from 'lottie-react-native';
import useBLE from '@hooks/useBLE';
import { getHex } from '@utils/hex';
import { get } from 'lodash';
// import { get } from 'lodash';
// import { bleManagerEmitter } from '@components/background-ble/BackgroundBle';
declare module 'react-native-ble-manager' {
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
    serviceUUIDs?: string[];
    characteristicUUIDs?: string[];
    id: string;
  }
}
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const SECONDS_TO_SCAN_FOR = 0;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;
export const handleSendOpenApp = () => {
  const dayNumber = dayjs().day();
  const dayNumberAdjusted = dayNumber === 0 ? 6 : dayNumber - 1;
  const time = dayjs().format('HH:mm:ss').toString();
  const str = time
    .split(':')
    .concat([dayNumberAdjusted + ''])
    .map(v => getHex(Number(v) - 1))
    .join('');
  console.log('*****', str);
  // await bleWrite(`57a005${str}61`);
  return `57a005${str}61`;
};
enum BleDeviceStatus {
  isScanning = 'isScanning',
  prepareConnect = 'prepareConnect',
  connecting = 'connecting',
  connected = 'connected',
}
type BleManagerBlockProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;
const BleManagerBlock: FC<BleManagerBlockProps> = props => {
  const { navigation } = props;
  const { t } = useTranslation();
  const [userOpt, setUserOpt] = useState<BleDeviceStatus>(
    BleDeviceStatus.isScanning,
  );
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );
  const [canUseDevice, setCanUseDevice] = useState<Set<string>>(new Set());
  // const update = useUpdate();
  // const startScan = useMemoizedFn(() => {
  //   BleManager.checkState().then((state: BleState) => {
  //     // if (state !== BleState.On) {
  //     Logger('当前蓝牙不可用' + state);
  //     //   return;
  //     // }
  //     if (userOpt === BleDeviceStatus.isScanning) {
  //       // reset found peripherals before scan
  //       Logger('1');
  //       setPeripherals(new Map<Peripheral['id'], Peripheral>());

  //       try {
  //         console.debug('[startScan] starting scan...');
  //         BleManager.scan(
  //           SERVICE_UUIDS,
  //           SECONDS_TO_SCAN_FOR,
  //           ALLOW_DUPLICATES,
  //           {
  //             matchMode: BleScanMatchMode.Sticky,
  //             scanMode: BleScanMode.LowLatency,
  //             callbackType: BleScanCallbackType.AllMatches,
  //           },
  //         )
  //           .then(() => {
  //             console.debug('[startScan] scan promise returned successfully.');
  //             update();
  //             BleManager.checkState();
  //           })
  //           .catch((err: any) => {
  //             console.error('[startScan] ble scan returned in error', err);
  //           });
  //       } catch (error) {
  //         console.error('[startScan] ble scan error thrown ', error);
  //       }
  //     }
  //   });
  // });
  const startScan = () => {
    if (userOpt === BleDeviceStatus.isScanning) {
      // reset found peripherals before scan
      setPeripherals(new Map<Peripheral['id'], Peripheral>());

      try {
        console.debug('[startScan] starting scan...');
        // setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {
            console.debug('[startScan] scan promise returned successfully.');
          })
          .catch((err: any) => {
            console.error('[startScan] ble scan returned in error', err);
          });
      } catch (error) {
        console.error('[startScan] ble scan error thrown', error);
      }
    }
  };
  const handleStopScan = () => {
    setUserOpt(BleDeviceStatus.connected);
    console.debug('[handleStopScan] scan is stopped.');
  };
  // TODO：关机判断 -> 二次链接
  // 链接 禁用 done + loading
  // 白色换掉 done
  // 灯带拖拽一直发统一指令 done
  // 麦克风指令排查 done
  // 切换 黑色框 没有默认值 -> 问题四 // done
  // 反向灯带 点不过去 没问题
  // 定时操作指令排查 done
  // 去掉紫色底色 done
  // 灯带开启 on给个颜色 yellow done
  const handleDisconnectedPeripheral = (
    event: BleDisconnectPeripheralEvent,
  ) => {
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
    setPeripherals(map => {
      let p = map.get(event.peripheral);
      if (p) {
        p.connected = false;
        return new Map(map.set(event.peripheral, p));
      }
      return map;
    });
  };

  const handleConnectPeripheral = (event: any) => {
    console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`);
  };

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    console.debug(
      '[handleDiscoverPeripheral] new BLE peripheral=',
      peripheral.name,
    );
    if (peripheral.name?.startsWith('Lumii') && peripheral.id) {
      setPeripherals(map => {
        return new Map(map.set(peripheral.id, peripheral));
      });
      setUserOpt(BleDeviceStatus.prepareConnect);
      setCanUseDevice(prev => {
        prev.add(peripheral.id);
        return new Set(prev);
      });
    }
  };

  const togglePeripheralConnection = async (peripheral: Peripheral) => {
    if (!peripheral.connected) {
      await connectPeripheral(peripheral);
    }
  };

  const retrieveConnected = async () => {
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals();
      if (connectedPeripherals.length === 0) {
        console.warn('[retrieveConnected] No connected peripherals found.');
        return;
      }

      console.debug(
        '[retrieveConnected] connectedPeripherals',
        connectedPeripherals,
      );

      for (var i = 0; i < connectedPeripherals.length; i++) {
        var peripheral = connectedPeripherals[i];
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connected = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });
      }
    } catch (error) {
      console.error(
        '[retrieveConnected] unable to retrieve connected peripherals.',
        error,
      );
    }
  };

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      if (peripheral) {
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });
        await BleManager.stopScan();
        await BleManager.connect(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = false;
            p.connected = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });
        await sleep(900);
        try {
          if (Platform.OS === 'android') {
            // const maxLength =
            //   await BleManager.getMaximumWriteValueLengthForWithoutResponse(
            //     peripheral.id,
            //   );
            // console.log(maxLength);
            // const mtu = await BleManager.requestMTU(
            //   peripheral.id,
            //   maxLength > 500 ? maxLength : 510,
            // );
            // Toast.show(`MTU size changed to ${mtu} bytes`, {
            //   position: Toast.positions.CENTER,
            // });
          }
        } catch (error) {
          console.log(`Failed to change MTU size: ${error}`);
          Toast.show(`Failed to change MTU size: ${error}`, {
            position: Toast.positions.CENTER,
          });
        }

        // before retrieving services, it is often a good idea to let bonding & connection finish properly
        await sleep(900);

        /* Test read current RSSI value, retrieve services first */
        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
          peripheralData,
        );
        const serviceUUIDs = peripheralData.characteristics?.map(
          v => v.service,
        );
        const characteristicUUIDs = peripheralData.characteristics?.map(
          v => v.characteristic,
        );

        const rssi = await BleManager.readRSSI(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
        );

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
      }
    } catch (error) {
      console.error(
        `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
        error,
      );
    }
  };

  function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }
  const handleUpdateValueForCharacteristic = useMemoizedFn(
    async (data: BleManagerDidUpdateValueForCharacteristicEvent) => {
      try {
        await BleManager.startNotification(
          data.peripheral,
          data.service,
          data.characteristic,
        );
        const peripheralData = await BleManager.retrieveServices(
          data.peripheral,
        );
        const readData = get(peripheralData, 'characteristics.0.value', {
          bytes: [] as number[],
        });
        const decodedBytes = Buffer.from(readData.bytes);
        const code = decodedBytes.toString('hex');
        const decimalValue = parseInt(code.slice(-4, -2), 16);
        setInfo(decimalValue);
        console.log(decimalValue);
      } catch (e) {
        console.log(e);
      }
    },
  );

  useEffect(() => {
    BleManager.start({ showAlert: false })
      .then(() => {
        Toast.show(t('BleManager-started'));
        // 开始扫描
        setTimeout(() => {
          startScan();
          // Toast.show('开始扫描');
        }, 4000);
      })
      .catch((error: any) =>
        Toast.show(`BeManager could not be started.${error.message}`),
      );
    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      ),
      bleManagerEmitter.addListener(
        'BleManagerConnectPeripheral',
        handleConnectPeripheral,
      ),
    ];

    handleAndroidPermissions();

    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        // listener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAndroidPermissions = useMemoizedFn(() => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
              );
            }
          });
        }
      });
    }
  });
  const [deviceInfo, setDeviceInfo] = useState<Peripheral>();
  const [_, setGlobalDeviceInfo] = useRecoilState(deviceInfoState);
  const [d, setD] = useState(false);
  const { getBLEBatteryPower } = useBLE();
  const [, setInfo] = useRecoilState(butteryState);
  const { run: handleConnectedBLE } = useDebounceFn(
    async () => {
      if (d) {
        return;
      }
      setD(true);
      try {
        // 当前取第一个可操作蓝牙
        const device = Array.from(canUseDevice).at(0)!;
        const info = peripherals.get(device)!;
        await togglePeripheralConnection(info);
        let localDevice = (await AsyncStorage.getItem(
          'device_info',
        )) as unknown as any[];
        if (localDevice) {
          localDevice = JSON.parse(
            localDevice as unknown as string,
          ) as unknown as any[];
          localDevice = localDevice?.map(item => {
            return {
              ...item,
              currentStatus: 'undo',
            };
          });
          localDevice.push({ ...info, currentStatus: 'do' });
        } else {
          localDevice = [];
          localDevice.push({ ...info, currentStatus: 'do' });
        }
        await AsyncStorage.setItem('device_info', JSON.stringify(localDevice));
        setDeviceInfo(info);
        setGlobalDeviceInfo(info);
        getBLEBatteryPower().then(a => setInfo(a ?? 100));
      } catch (e) {
        Toast.show((e as Error).message);
      }

      // 数据共享到系统中
    },
    { leading: true },
  );
  useMount(() => {
    Logger(`deviceInfo?.connected ${deviceInfo?.connected}`);
    if (deviceInfo?.connected) {
      // 路由跳转
      navigation.replace('Home', { screen: 'DesignScreen' });
    }
  });

  const [lan, setLanguage] = useState<'zh' | 'en'>('zh');
  useMount(() => {
    const { language } = getI18n();
    setLanguage(language as 'zh' | 'en');
  });
  return (
    <View style={styles.body}>
      <StatusBar />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 156,
        }}>
        <LottieView
          source={require('../../assets/lottie/logo.json')}
          autoPlay
          loop
          style={{ width: 375, height: 370 }}
        />
      </View>
      {userOpt === BleDeviceStatus.isScanning ? (
        <TouchableWithoutFeedback
        // onPress={() => navigation.push('Home', { screen: 'DesignScreen' })}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              marginHorizontal: 83 / 2,
              position: 'absolute',
              left: 0,
              bottom: 175 / 2,
            }}>
            {lan === 'en' ? (
              <LottieView
                source={require('../../assets/lottie/reboten.json')}
                autoPlay
                style={{
                  width: Dimensions.get('window').width - 83,
                  height: 52,
                }}
                loop={false}
              />
            ) : (
              <LottieView
                source={require('../../assets/lottie/rebotzh.json')}
                autoPlay
                style={{
                  width: Dimensions.get('window').width - 83,
                  height: 52,
                }}
                loop={false}
              />
            )}
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 155 / 2,
              }}>
              {lan === 'en' ? (
                <LottieView
                  source={require('../../assets/lottie/search.json')}
                  autoPlay
                  loop
                  style={{ width: 89, height: 19 }}
                />
              ) : (
                <LottieView
                  source={require('../../assets/lottie/zhsearch.json')}
                  autoPlay
                  loop
                  style={{ width: 89, height: 19 }}
                />
              )}
              {/* <Text style={{ color: '#FDFDFD', fontSize: 16 }}>
                {t('ble-search')}…
              </Text> */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View
          style={{
            position: 'absolute',
            bottom: 8,
            left: 5,
            right: 5,
            backgroundColor: '#F6F5F6',
            borderRadius: 30,
            paddingVertical: 28,
            paddingHorizontal: 24,
          }}>
          {/* <TouchableHighlight
          style={{
            overflow: 'hidden',
            position: 'absolute',
            top: 20,
            right: 29,
          }}>
          <Image
            source={require('../../assets/toast-close.png')}
            style={{
              width: 24,
              height: 24,
            }}
          />
        </TouchableHighlight> */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#000000',
              textAlign: 'center',
            }}>
            Wagii Lumii
          </Text>
          <View style={{ marginVertical: 32, height: 212 }}>
            <Video
              source={videoMp4}
              paused={false}
              repeat={true}
              muted
              style={{ flex: 1 }}
              resizeMode="cover"
            />
          </View>
          <TouchableHighlight
            style={{ flex: 1, overflow: 'hidden' }}
            onPress={handleConnectedBLE}
            disabled={d}>
            <View
              style={{
                backgroundColor: 'rgba(215, 220, 225, 0.43)',
                height: 50,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#333333',
                }}>
                {d ? t('ble-connecting') : t('ble-connect')}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'rgba(19, 20, 22, 1)',
  },
});

export default BleManagerBlock;
