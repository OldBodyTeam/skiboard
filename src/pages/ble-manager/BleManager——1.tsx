/**
 * Sample BLE React Native App
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
  Pressable,
  Image,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Buffer } from 'buffer';
import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleState,
  Peripheral,
} from 'react-native-ble-manager';
import { Toast } from 'react-native-ui-lib';
import Video from 'react-native-video';
import videoMp4 from './connected.mp4';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const SECONDS_TO_SCAN_FOR = 0;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;
declare module 'react-native-ble-manager' {
  // enrich local contract with custom state properties needed by App.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

const BleManagerBlock = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );

  //console.debug('peripherals map updated', [...peripherals.entries()]);

  const startScan = () => {
    BleManager.checkState().then((state: BleState) => {
      if (state !== BleState.On || state !== BleState.TurningOn) {
        Toast('当前蓝牙不可用');
        return;
      }
      if (!isScanning) {
        // reset found peripherals before scan
        setPeripherals(new Map<Peripheral['id'], Peripheral>());

        try {
          console.debug('[startScan] starting scan...');
          setIsScanning(true);
          BleManager.scan(
            SERVICE_UUIDS,
            SECONDS_TO_SCAN_FOR,
            ALLOW_DUPLICATES,
            {
              // matchMode: BleScanMatchMode.Sticky,
              // scanMode: BleScanMode.LowLatency,
              // callbackType: BleScanCallbackType.AllMatches,
            },
          )
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
    });
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('[handleStopScan] scan is stopped.');
  };

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

  const handleUpdateValueForCharacteristic = (
    data: BleManagerDidUpdateValueForCharacteristicEvent,
  ) => {
    console.debug(
      `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
    );
  };

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    console.debug(
      '[handleDiscoverPeripheral] new BLE peripheral=',
      peripheral.name,
    );
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    } else if (peripheral.name?.startsWith('Wagli')) {
      setPeripherals(map => {
        return new Map(map.set(peripheral.id, peripheral));
      });
    }
  };

  const togglePeripheralConnection = async (peripheral: Peripheral) => {
    if (peripheral && peripheral.connected) {
      try {
        await BleManager.disconnect(peripheral.id);
      } catch (error) {
        console.error(
          `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
          error,
        );
      }
    } else {
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

        // before retrieving services, it is often a good idea to let bonding & connection finish properly
        await sleep(900);

        /* Test read current RSSI value, retrieve services first */
        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
          peripheralData,
        );

        const rssi = await BleManager.readRSSI(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
        );
        console.log(peripheralData.characteristics);

        if (peripheralData.characteristics) {
          for (let characteristic of peripheralData.characteristics) {
            console.log('--------------->', peripheral.id);
            console.log(characteristic.descriptors);
            if (characteristic.descriptors) {
              for (let descriptor of characteristic.descriptors) {
                try {
                  let data = await BleManager.readDescriptor(
                    peripheral.id,
                    characteristic.service,
                    characteristic.characteristic,
                    descriptor.uuid,
                  );
                  console.debug(
                    `[connectPeripheral][${peripheral.id}] ${characteristic.service} ${characteristic.characteristic} ${descriptor.uuid} descriptor read as:`,
                    data,
                  );
                } catch (error) {
                  console.error(
                    `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                    error,
                  );
                }
              }
            }
          }
        }

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.rssi = rssi;
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

  useEffect(() => {
    try {
      BleManager.start({ showAlert: false })
        .then(() => console.debug('BleManager started.'))
        .catch((error: any) =>
          console.error('BeManager could not be started.', error),
        );
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }

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
        listener.remove();
      }
    };
  }, []);

  const handleAndroidPermissions = () => {
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
  };

  const renderItem = ({ item }: { item: Peripheral }) => {
    const backgroundColor = item.connected ? '#069400' : Colors.white;
    return (
      <TouchableHighlight
        underlayColor="#0082FC"
        onPress={() => togglePeripheralConnection(item)}>
        <View style={[styles.row, { backgroundColor }]}>
          <Text style={styles.peripheralName}>
            {/* completeLocalName (item.name) & shortAdvertisingName (advertising.localName) may not always be the same */}
            {item.name} - {item?.advertising?.localName}
            {item.connecting && ' - Connecting...'}
          </Text>
          <Text style={styles.rssi}>RSSI: {item.rssi}</Text>
          <Text style={styles.peripheralId}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <View style={styles.body}>
      <StatusBar />
      <SafeAreaView style={styles.body}>
        <Pressable style={styles.scanButton} onPress={startScan}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth'}
          </Text>
        </Pressable>

        <Pressable style={styles.scanButton} onPress={retrieveConnected}>
          <Text style={styles.scanButtonText}>
            {'Retrieve connected peripherals'}
          </Text>
        </Pressable>

        {Array.from(peripherals.values()).length === 0 && (
          <View style={styles.row}>
            <Text style={styles.noPeripherals}>
              No Peripherals, press "Scan Bluetooth" above.
            </Text>
          </View>
        )}
        <Pressable
          style={styles.scanButton}
          onPress={() => {
            BleManager.checkState().then(state =>
              console.log(`current BLE state = '${state}'.`),
            );
          }}>
          <Text style={styles.scanButtonText}>点击检查状态</Text>
        </Pressable>
        <Pressable
          style={styles.scanButton}
          onPress={async () => {
            await BleManager.startNotification(
              '9bbf4eb4-17fc-e3bc-a991-008d20ba9624', // connectPeripheral
              // 9BBF4EB4-17FC-E3BC-A991-008D20BA9624
              '49535343-fe7d-4ae5-8fa9-9fafd205e455', // services
              '49535343-8841-43f4-a8d4-ecbe34729bb3', // characteristic
            );
            bleManagerEmitter.addListener(
              'BleManagerDidUpdateValueForCharacteristic',
              ({ value, peripheral, characteristic, service }) => {
                // Convert bytes array to string
                console.log(value);
                const buffer1 = Buffer.from('60');
                const sensorData = buffer1.readUInt8(1);
                console.log(buffer1.toJSON().data);
                const data = Buffer.copyBytesFrom(value).toString();
                console.log(
                  `Received ${value} for characteristic ${characteristic} --- ${data}`,
                );
              },
            );
            await BleManager.read(
              '9bbf4eb4-17fc-e3bc-a991-008d20ba9624', // connectPeripheral
              // 9BBF4EB4-17FC-E3BC-A991-008D20BA9624
              '49535343-fe7d-4ae5-8fa9-9fafd205e455', // services
              '49535343-8841-43f4-a8d4-ecbe34729bb3', // characteristic
            ).then(readData => {
              console.log('Read: ' + readData);
              const buffer2 = Buffer.from('60', 'hex');
              console.log('*****', buffer2.toJSON().data);
            });
          }}>
          <Text style={styles.scanButtonText}>收取推送</Text>
        </Pressable>
        <Pressable
          style={styles.scanButton}
          onPress={() => {
            BleManager.writeWithoutResponse(
              '9bbf4eb4-17fc-e3bc-a991-008d20ba9624', // connectPeripheral
              // 9BBF4EB4-17FC-E3BC-A991-008D20BA9624
              '49535343-fe7d-4ae5-8fa9-9fafd205e455', // services
              '49535343-8841-43f4-a8d4-ecbe34729bb3', // characteristic
              // encode & extract raw `number[]`.
              // Each number should be in the 0-255 range as it is converted from a valid byte.
              Buffer.from('5701020161', 'hex').toJSON().data,
            )
              .then(() => {
                // Success code
                console.log('Success code');
                console.log(
                  'Write: ' + Buffer.from('5701020061', 'hex').toJSON().data,
                );
              })
              .catch(error => {
                // Failure code
                console.log('Failure code');
                console.log(error);
              });
          }}>
          <Text style={styles.scanButtonText}>发送开灯指令</Text>
        </Pressable>

        <FlatList
          data={Array.from(peripherals.values())}
          contentContainerStyle={{ rowGap: 12 }}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
      <View
        style={{
          position: 'absolute',
          bottom: 8,
          left: 5,
          right: 5,
          backgroundColor: '#FDFDFD',
          borderRadius: 30,
          paddingVertical: 28,
          paddingHorizontal: 24,
        }}>
        <TouchableHighlight
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
        </TouchableHighlight>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#000000',
            textAlign: 'center',
          }}>
          Wagii Lumii
        </Text>
        <View
          style={{ marginVertical: 32, height: 212, backgroundColor: 'red' }}>
          <Video
            source={videoMp4}
            paused={false}
            repeat={true}
            muted
            style={{ flex: 1 }}
          />
        </View>
        <TouchableHighlight style={{ flex: 1, overflow: 'hidden' }}>
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
              Connect
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const boxShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    color: Colors.black,
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#0a398a',
    margin: 10,
    borderRadius: 12,
    ...boxShadow,
  },
  scanButtonText: {
    fontSize: 20,
    letterSpacing: 0.25,
    color: Colors.white,
  },
  body: {
    // backgroundColor: '#0082FC',
    flex: 1,
    position: 'relative',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  peripheralName: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  rssi: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
  },
  peripheralId: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    paddingBottom: 20,
  },
  row: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    ...boxShadow,
  },
  noPeripherals: {
    margin: 10,
    textAlign: 'center',
    color: Colors.white,
  },
});

export default BleManagerBlock;
