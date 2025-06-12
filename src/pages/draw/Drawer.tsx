import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  StatusBar,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { covertCanUseCanvasData, drawData, getPointPoi, poi } from './config';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useScreenSize } from '@hooks/useScreenSize';
import { runOnJS } from 'react-native-reanimated';
import { useDebounceFn, useMemoizedFn, useMount, useThrottleFn } from 'ahooks';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import SliderDraw from './SliderDraw';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'route.config';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-root-toast';
import Header from './Header';
import { ClientRequest } from '@services/client';
import { BLEConfig } from '@utils/ble';
import useBLE from '@hooks/useBLE';
import { useSend } from '@utils/send';
import { getHex, getSimpleHex } from '@utils/hex';
// import { useRecoilState } from 'recoil';
import { userInfoState } from '@stores/login/login.atom';
import useToast from '@hooks/useToast';
import { useAtomValue } from 'jotai';
// import { v4 } from 'uuid';
const windowWidth = Dimensions.get('window').width;
type DrawerProps = NativeStackScreenProps<RootStackParamList, 'ScrollText'> &
  PropsWithChildren<{ name?: string }>;
export type ItemsProps = {
  width: number;
  selected: boolean;
  a?: boolean;
  b?: boolean;
};
export const Items: FC<ItemsProps> = props => {
  const { selected, width, a, b } = props;

  return (
    <View
      style={StyleSheet.compose(
        styles.items,
        !a
          ? {
              width: width,
              height: width,
              borderRadius: width,
              backgroundColor: b
                ? selected
                  ? '#F7E54C'
                  : '#715DEE'
                : selected
                ? '#F7E54C'
                : '#D8D8D8',
            }
          : {
              width: width,
              height: width,
              borderRadius: width,
              backgroundColor: selected ? '#F7E54C' : 'transparent',
            },
      )}
    />
  );
};

const Drawer: FC<DrawerProps> = props => {
  const { t } = useTranslation();
  const { navigation, route } = props;
  const { collectionId, from } = route.params || {};
  const { bleWrite } = useBLE();
  const canvasData = covertCanUseCanvasData(drawData);
  const [target, setTarget] = useState<Set<string>>(new Set());
  const [selectedList, setSelectedList] = useState<Set<string>>(new Set());
  // const [clear, setClear] = useState(false);
  const [btnStatus, setStatus] = useState({
    edit: true,
    clear: false,
    move: false,
  });
  const userInfo = useAtomValue(userInfoState);
  const showToast = useToast();
  const getCollectionList = async () => {
    try {
      const client = await ClientRequest();
      const responseData = await client.collectionControllerGetCollectionList(
        userInfo?.id ?? '',
      );
      const collection = responseData.data.data;
      return collection;
    } catch (e) {
      showToast(`${(e as Error).message}`);
    }
  };
  const [collectionNum, setCollectionNum] = useState(1);
  useMount(async () => {
    try {
      const collectionData = await getCollectionList();
      // @ts-ignore
      if ((collectionData?.length ?? 0) > 10) {
        showToast(t('max-limit'));
        navigation.push('Home', { screen: 'DesignScreen' });
        return;
      }
      // @ts-ignore
      setCollectionNum((collectionData?.length ?? 0) + 1);
      if (collectionId) {
        const i = (collectionData as unknown as any[]).findIndex(
          item => item.id === collectionId,
        );
        setCollectionNum(i + 1);
      } else {
        // @ts-ignore
        // setCollectionNum((collectionData?.length ?? 0) + 1 ?? 1);
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  });
  const [moveStartPoint, setMoveStartPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [originalPositions, setOriginalPositions] = useState<
    Map<string, { r: number; c: number }>
  >(new Map());
  const [isMoving, setIsMoving] = useState(false);
  const [tempSelectedList, setTempSelectedList] = useState<Set<string>>(
    new Set(),
  );
  const [currentDelta, setCurrentDelta] = useState<{
    deltaX: number;
    deltaY: number;
  }>({ deltaX: 0, deltaY: 0 });

  const onMoveStart = useMemoizedFn((e: any) => {
    if (btnStatus.move && selectedList.size > 0) {
      setMoveStartPoint({ x: e.x, y: e.y });
      setIsMoving(true);
      setCurrentDelta({ deltaX: 0, deltaY: 0 });

      // 预计算原始位置
      const origPos = new Map<string, { r: number; c: number }>();
      selectedList.forEach(point => {
        const [r, c] = point.split('-').map(Number);
        origPos.set(point, { r, c });
      });
      setOriginalPositions(origPos);
      setTempSelectedList(new Set([...selectedList]));
    }
  });

  // 优化的移动更新函数，带节流处理
  const { run: onMoveUpdate } = useThrottleFn(
    (e: any) => {
      if (
        !btnStatus.move ||
        !isMoving ||
        !moveStartPoint ||
        originalPositions.size === 0
      ) {
        return;
      }

      const deltaX = Math.round((e.x - moveStartPoint.x) / currentWidth);
      const deltaY = Math.round((e.y - moveStartPoint.y) / currentWidth);

      // 如果移动距离没有变化，跳过处理
      if (deltaX === currentDelta.deltaX && deltaY === currentDelta.deltaY) {
        return;
      }

      // 边界检查优化：只检查边界条件，不重复计算位置
      let canMove = true;
      for (const [point, pos] of originalPositions) {
        const newR = pos.r + deltaY;
        const newC = pos.c + deltaX;

        if (
          newR < 0 ||
          newR >= canvasData.length ||
          newC < 0 ||
          newC >= canvasData[newR]?.length
        ) {
          canMove = false;
          break; // 早期退出优化
        }
      }

      if (canMove) {
        // 批量更新新位置
        const newSelectedList = new Set<string>();
        originalPositions.forEach((pos, point) => {
          newSelectedList.add(`${pos.r + deltaY}-${pos.c + deltaX}`);
        });

        setTempSelectedList(newSelectedList);
        setCurrentDelta({ deltaX, deltaY });
      }
      // 如果不能移动，保持当前位置不变，不进行额外操作
    },
    { wait: 16 }, // 约60fps的更新频率
  );

  const a = (e: any) => {
    const poi = getPointPoi.find(item => {
      if (
        e.x >= item.x &&
        e.x <= item.x + item.width &&
        e.y >= item.y &&
        e.y <= item.y + item.height
      ) {
        return true;
      } else {
        return false;
      }
    });

    if (btnStatus.move) {
      if (!isMoving) {
        onMoveStart(e);
      } else {
        onMoveUpdate(e);
      }
    } else {
      // Original behavior for edit and clear modes
      setSelectedList(prev => {
        if (poi && !prev.has(poi?.target) && poi?.target && !btnStatus.clear) {
          prev.add(poi?.target);
          setTarget(new Set([...prev]));
          return new Set([...prev]);
        } else if (
          poi &&
          prev.has(poi?.target) &&
          poi?.target &&
          btnStatus.clear
        ) {
          prev.delete(poi?.target);
          return new Set([...prev]);
        } else {
          return prev;
        }
      });
    }
  };
  const b = (_e: any) => {
    if (btnStatus.move && isMoving) {
      // 确认新位置
      setSelectedList(new Set([...tempSelectedList]));
      setTarget(new Set([...tempSelectedList]));

      // 重置移动状态
      resetMoveState();
    } else if (!btnStatus.move) {
      // Original behavior
      if (!btnStatus.clear) {
        setCurrentStatus({ prev: false, next: true });
      } else {
        setCurrentStatus({ prev: true, next: false });
      }
    }
  };

  const panGesture = Gesture.Pan()
    .shouldCancelWhenOutside(false)
    .minDistance(1)
    .onStart(e => {
      'worklet';
      runOnJS(a)(e);
    })
    .onUpdate(e => {
      'worklet';
      if (btnStatus.move) {
        // 移动模式下直接调用优化的节流函数
        runOnJS(onMoveUpdate)(e);
      } else {
        runOnJS(a)(e);
      }
    })
    .onEnd(e => {
      'worklet';
      runOnJS(b)(e);
    })
    .onFinalize(() => {
      'worklet';
      // 确保手势结束时清理状态
      if (btnStatus.move) {
        runOnJS(b)({});
      }
    });
  const tap = Gesture.Tap().onEnd(e => {
    'worklet';
    runOnJS(a)(e);
    runOnJS(b)(e);
  });
  const composed = Gesture.Race(panGesture, tap);
  const [currentStatus, setCurrentStatus] = useState({
    prev: true,
    next: true,
  });

  const handleNext = useMemoizedFn(() => {
    const pointer = selectedList.size;
    const originList = Array.from(target);
    const currentList = Array.from(selectedList);
    if (originList[pointer]) {
      currentList.push(originList[pointer]);
      if (currentList.length === target.size) {
        setCurrentStatus(p => {
          return {
            ...p,
            next: true,
          };
        });
      } else {
        setCurrentStatus(p => {
          return {
            ...p,
            prev: false,
          };
        });
      }
      setSelectedList(new Set([...currentList]));
    }
  });
  const handlePrev = useMemoizedFn(() => {
    const originList = Array.from(selectedList);
    originList.pop();
    if (originList.length === 0) {
      setCurrentStatus(p => {
        return {
          ...p,
          prev: true,
        };
      });
    } else {
      setCurrentStatus(p => {
        return {
          ...p,
          next: false,
        };
      });
    }
    setSelectedList(new Set([...originList]));
  });

  const resetMoveState = useMemoizedFn(() => {
    setMoveStartPoint(null);
    setIsMoving(false);
    setOriginalPositions(new Map());
    setTempSelectedList(new Set());
    setCurrentDelta({ deltaX: 0, deltaY: 0 });
    // 取消待处理的节流函数调用
    onMoveUpdate.cancel();
  });

  const handleEditDrawer = useMemoizedFn(() => {
    resetMoveState();
    setStatus(() => {
      return {
        edit: true,
        clear: false,
        move: false,
      };
    });
  });

  const handleClear = useMemoizedFn(() => {
    resetMoveState();
    setStatus(() => {
      return {
        edit: false,
        clear: true,
        move: false,
      };
    });
  });

  const handleEdit = useMemoizedFn(() => {
    resetMoveState();
    setStatus(() => {
      return {
        edit: false,
        clear: false,
        move: true,
      };
    });
  });

  const { width } = useScreenSize();
  const currentWidth = useMemo(() => {
    const m = Math.floor(width / 17);
    const n = Math.floor(m / 2);
    return n * 2;
  }, [width]);
  const [frameList, setFrameList] = useState<Map<number, Set<string>>>(
    new Map(),
  );
  const [optFrameIndex, setOptFrameIndex] = useState<number>(1);
  useMount(() => {
    setFrameList(prev => {
      prev.set(1, new Set());
      return new Map(prev);
    });
    setOptFrameIndex(1);
  });

  const handleSelectedFrame = useMemoizedFn((index: number) => {
    console.log('add or selected', index);
    if (frameList.size === 10) {
      Toast.show(t('create-frame-tips'), { position: Toast.positions.CENTER });
      return;
    }
    setOptFrameIndex(index);
    if (frameList.has(index)) {
      // 设置
      const itemData = frameList.get(index)!;
      setSelectedList(new Set([...itemData]));
      setTarget(new Set([...itemData]));
    } else {
      setFrameList(prev => {
        prev.set(index, new Set());
        return new Map(prev);
      });
      setSelectedList(new Set());
      setTarget(new Set());
    }
  });

  useEffect(() => {
    console.log('&&&&&&&&&&', optFrameIndex);
    setFrameList(prev => {
      prev.set(optFrameIndex, new Set([...selectedList]));
      return new Map(prev);
    });
  }, [selectedList, optFrameIndex]);

  const handlePress = () => {
    navigation.goBack();
  };

  const [speed, setSpeed] = useState(0);
  const handleSpeed = useMemoizedFn((x: number) => {
    setSpeed(x);
    // @ts-ignore
    bleWrite(BLEConfig.editLight[x]);
  });

  const handleCopyEvent = useMemoizedFn((index: number) => {
    if (frameList.size === 10) {
      Toast.show(t('create-frame-tips'), { position: Toast.positions.CENTER });
      return;
    }
    setOptFrameIndex(frameList.size + 1);
    if (frameList.has(index)) {
      // 设置
      const itemData = frameList.get(index)!;
      setSelectedList(new Set([...itemData]));
      setTarget(new Set([...itemData]));
    }
  });
  const handleDeleteEvent = useMemoizedFn((index: number) => {
    if (frameList.size <= 1) {
      Toast.show(t('delete-frame-tips'), {
        position: Toast.positions.CENTER,
      });
      return;
    }
    const keys = Array.from(frameList.keys()).filter(v => v !== index);

    const i = keys?.at(0) ?? 1;
    setOptFrameIndex(i);
    setSelectedList(new Set([...(frameList.get(i) ?? [])]));
    setFrameList(prev => {
      prev.delete(index);
      return new Map(prev);
    });
  });
  const { queue, consumer } = useSend();

  const handleBlueData = useMemoizedFn(() => {
    let i = 1;
    frameList.forEach((value, key) => {
      const item = Array.from(value).map(v => poi.get(v));
      console.log('frameList', item.join(''));
      console.log(
        `57e0${getHex(item.length + 2)}00${getSimpleHex(
          collectionNum,
        )}${getSimpleHex(key)}${item.join('')}61`,
      );
      // 同步 预览亮 创建不亮
      // 问题：新编辑永远在第二个 1,2,3,4
      queue.enqueue(
        `57e0${getHex(item.length + 2)}00${getSimpleHex(
          collectionNum,
        )}${getSimpleHex(i)}${item.join('')}61`,
      );
      i++;
    });
    queue.enqueue(`57e00301${getSimpleHex(collectionNum)}061`);
    // @ts-ignore
    queue.enqueue(BLEConfig.editLight[speed]);
    consumer.startConsuming(bleWrite);
  });
  const [title, setTitle] = useState('Smiling Face');
  const createCollection = async () => {
    const serverData = [] as { selected: boolean; frame: string[] }[];
    frameList.forEach((value, key) => {
      serverData.push({
        selected: key === optFrameIndex,
        frame: Array.from(value),
      });
    });
    try {
      const client = await ClientRequest();
      client.collectionControllerCreate(userInfo?.id ?? '', {
        name: title,
        frameList: JSON.stringify(serverData),
      });
      navigation.push('LightList');
      showToast(t('Creation-Successful'));
    } catch (e) {
      showToast(t('Creation-Failed'));
    }
  };
  const updateCollection = async () => {
    const serverData = [] as { selected: boolean; frame: string[] }[];
    frameList.forEach((value, key) => {
      serverData.push({
        selected: key === optFrameIndex,
        frame: Array.from(value),
      });
    });
    try {
      const client = await ClientRequest();
      await client.collectionControllerModifyCollection(
        collectionId,
        Object.assign(
          {
            name: title,
          },
          { frameList: JSON.stringify(serverData) },
        ),
      );
      navigation.push('LightList');
      showToast(t('Update-Successful'));
    } catch (e) {
      showToast(t('Update-Failed'));
    }
  };
  const { run: handleSave } = useDebounceFn(() => {
    if (from === 'creative') {
      if (collectionNum >= 10) {
        showToast(t('max-limit'));
        return;
      }
      createCollection();
    } else {
      collectionId ? updateCollection() : createCollection();
    }
    handleBlueData();
  });
  const { run: handleSinglePreview } = useDebounceFn(async () => {
    // const frame = frameList.get(optFrameIndex);
    // if (frame) {
    //   const item = Array.from(frame).map(v => poi.get(v));
    //   await bleWrite(
    //     `57e0${getHex(item.length + 2)}00${getSimpleHex(
    //       collectionNum,
    //     )}${getSimpleHex(optFrameIndex)}${item.join('')}61`,
    //   );
    //   await bleWrite('57e003011061');
    // }
    handleBlueData();
  });
  const getCollection = async () => {
    try {
      const client = await ClientRequest();
      const responseData = await client.collectionControllerGetCollectionDetail(
        collectionId,
      );
      const collectionDetail = responseData.data.data;
      (
        collectionDetail?.frameList as unknown as {
          selected: boolean;
          frame: string[];
        }[]
      ).forEach((element, index) => {
        setFrameList(prev => {
          prev.set(index + 1, new Set([...element.frame]));
          return new Map(prev);
        });
        if (element.selected) {
          setOptFrameIndex(index + 1);
          setSelectedList(new Set([...element.frame]));
          setTarget(new Set([...element.frame]));
        }
      });
      setTitle(collectionDetail?.name ?? 'Smiling Face');
    } catch (e) {
      console.log(e);
    }
  };
  useMount(() => {
    if (collectionId) {
      getCollection();
    }
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#5938EC' }}>
      <StatusBar />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#5938EC' }}
        edges={{ bottom: 'off', top: 'additive' }}>
        <Header
          handlePress={handlePress}
          onChange={(c: string) => {
            setTitle(c);
          }}
          title={title}
        />
        <View style={styles.page}>
          <GestureDetector gesture={composed}>
            <View style={styles.container}>
              {canvasData.map((rows, r) => {
                return (
                  <View key={r} style={styles.rows}>
                    {rows.map((item, c) => {
                      return (
                        <Items
                          key={`${r}-${c}`}
                          width={currentWidth}
                          selected={
                            btnStatus.move &&
                            isMoving &&
                            tempSelectedList.size > 0
                              ? tempSelectedList.has(`${r}-${c}`)
                              : selectedList.has(`${r}-${c}`)
                          }
                          b
                        />
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </GestureDetector>
          <BlurView
            style={styles.userOptBlock}
            tint="systemThinMaterialDark"
            blurReductionFactor={10}
            // experimentalBlurMethod="dimezisBlurView"
          >
            <View style={styles.leftOpt}>
              <TouchableOpacity
                onPress={handlePrev}
                disabled={currentStatus.prev}>
                <Image
                  source={
                    currentStatus.prev
                      ? require('../../assets/draw/letf-tra.png')
                      : require('../../assets/draw/left.png')
                  }
                  style={styles.prev}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNext}
                disabled={currentStatus.next}>
                <Image
                  source={
                    currentStatus.next
                      ? require('../../assets/draw/right-tra.png')
                      : require('../../assets/draw/right.png')
                  }
                  style={styles.next}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={handleEditDrawer}>
                <Image
                  source={require('../../assets/draw/magic.png')}
                  style={StyleSheet.compose(styles.clear, {
                    backgroundColor: btnStatus.edit ? 'yellow' : 'white',
                    marginRight: 8,
                  })}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClear}>
                <Image
                  source={require('../../assets/draw/clean.png')}
                  style={StyleSheet.compose(styles.clear, {
                    backgroundColor: btnStatus.clear ? 'yellow' : 'white',
                    marginRight: 8,
                  })}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEdit}>
                <Image
                  source={require('../../assets/draw/edit.png')}
                  style={StyleSheet.compose(styles.clear, {
                    backgroundColor: btnStatus.move ? 'yellow' : 'white',
                  })}
                />
              </TouchableOpacity>
            </View>
          </BlurView>
          <View style={styles.cover}>
            <View style={styles.menuBlock}>
              <Text style={styles.frames}>{t('draw-light-frames')}</Text>
              <ScrollView horizontal style={styles.scrollBlock}>
                {Array.from(frameList.keys()).map((key, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => handleSelectedFrame(key)}
                      key={key}>
                      <View
                        style={[
                          styles.containerItem,
                          {
                            borderColor:
                              optFrameIndex === key ? '#5938EC' : '#000000',
                          },
                        ]}>
                        <TouchableWithoutFeedback
                          onPress={e => {
                            e.stopPropagation();
                            handleCopyEvent(key);
                          }}>
                          <Image
                            source={require('../../assets/draw/copy.png')}
                            style={styles.copy}
                          />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                          onPress={e => {
                            e.stopPropagation();
                            handleDeleteEvent(key);
                          }}>
                          <Image
                            source={require('../../assets/draw/delete.png')}
                            style={styles.delete}
                          />
                        </TouchableWithoutFeedback>
                        {canvasData.map((rows, r) => {
                          return (
                            <View key={r} style={styles.rows}>
                              {rows.map((item, c) => {
                                return (
                                  <Items
                                    key={`${r}-${c}`}
                                    width={6}
                                    selected={
                                      !!frameList.get(key)?.has(`${r}-${c}`)
                                    }
                                  />
                                );
                              })}
                            </View>
                          );
                        })}
                      </View>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  onPress={() => handleSelectedFrame(frameList.size + 1)}>
                  <View style={[styles.containerItem]}>
                    <Image
                      source={require('../../assets/draw/add.png')}
                      style={styles.blockAdd}
                    />
                  </View>
                </TouchableOpacity>
              </ScrollView>
              <View style={styles.slider}>
                <View style={{ marginRight: 9 }}>
                  <Text style={styles.speed}>{t('draw-light-speed')}</Text>
                </View>
                <SliderDraw onChange={handleSpeed} speed={speed} />
              </View>
              <View style={styles.btnBlock}>
                <TouchableOpacity onPress={handleSinglePreview}>
                  <View style={styles.previewBtn}>
                    <Text>{t('preview')}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave}>
                  <View style={styles.createBtn}>
                    <Text>{t('create')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#5938EC',
    position: 'relative',
  },
  cover: {
    backgroundColor: '#5938EC',
    marginTop: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rows: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  items: {
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: 'red',
  },
  containerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#000000',
    width: 150,
    height: 140,
    position: 'relative',
  },
  copy: {
    position: 'absolute',
    width: 16,
    height: 16,
    top: 5,
    right: 5,
  },
  delete: {
    position: 'absolute',
    width: 16,
    height: 16,
    bottom: 5,
    right: 5,
  },
  blockAdd: {
    width: 24,
    height: 24,
  },
  optBlock: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginTop: 22,
  },
  previewBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    color: '#333333',
    fontSize: 18,
    borderRadius: 24,
    backgroundColor: '#D7DCE1',
    flexBasis: '100%',
    width: (windowWidth - 8 - 48) / 2,
  },
  createBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    fontWeight: '600',
    color: '#333333',
    fontSize: 18,
    borderRadius: 24,
    backgroundColor: '#F7E54C',
    flexBasis: '100%',
    width: (windowWidth - 8 - 48) / 2,
  },
  menuBlock: {
    paddingHorizontal: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#F0F3F6',
    paddingBottom: 20,
    paddingTop: 24,
    overflow: 'hidden',
    width: Dimensions.get('window').width,
  },
  frames: {
    fontWeight: '600',
    color: '#333333',
    fontSize: 22,
    marginBottom: 16,
  },
  userOptBlock: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 9,
    flexDirection: 'row',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#9B88F4',
    marginHorizontal: 33,
    marginTop: 16,
  },
  prev: {
    width: 31,
    height: 31,
    borderRadius: 31,
    overflow: 'hidden',
    marginRight: 8,
  },
  next: {
    width: 31,
    height: 31,
    borderRadius: 31,
    overflow: 'hidden',
  },
  clear: {
    width: 31,
    height: 31,
    borderRadius: 31,
    overflow: 'hidden',
  },
  leftOpt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speed: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  scrollBlock: {
    marginBottom: 22,
  },
});
export default Drawer;
