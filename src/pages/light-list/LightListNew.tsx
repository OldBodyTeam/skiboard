import Header from '@components/header/Header';
import DrawItem from '@pages/draw/DrawItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { covertCanUseCanvasData, covertMap } from '@utils/draw-config';
import { FC, PropsWithChildren, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RootStackParamList } from 'route.config';
import React from 'react';
import { useScreenSize } from '@hooks/useScreenSize';
import BlurModal, { BlurModalRef } from '@components/blur-Modal/BlurModal';
import { ClientRequest } from '@services/client';
import Toast from 'react-native-root-toast';
import { useRecoilState } from 'recoil';
import { userInfoState } from '@stores/login/login.atom';
import { CollectionEntity } from '@services/data-contracts';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useDebounceFn, useMount } from 'ahooks';
// import { getHex, getSimpleHex } from '@utils/hex';
// import { useSend } from '@utils/send';
// import useBLE from '@hooks/useBLE';
import { drawData, poi } from '@pages/draw/config';
import { Items } from '@pages/draw/Drawer';
import { useSend } from '@utils/send';
import { getHex, getSimpleHex } from '@utils/hex';
import useBLE from '@hooks/useBLE';
import dayjs from 'dayjs';
type LightListProps = NativeStackScreenProps<RootStackParamList, 'LightList'> &
  PropsWithChildren<{ name?: string }>;
const windowWidth = Dimensions.get('window').width;
const LightListNew: FC<LightListProps> = props => {
  const { t } = useTranslation();
  const { navigation } = props;
  const back = () => {
    navigation.navigate('Home', { screen: 'DesignScreen' });
  };
  const [currenStatus, setCurrentStatus] = useState(false);
  const modalDeleteRef = useRef<BlurModalRef>(null);
  const [userInfo] = useRecoilState(userInfoState);
  const [deleteInfo, setDeleteInfo] = useState<{
    collectionId: string;
    frameIndex: number;
  }>();
  const [collectionInfo, setCollectionInfo] = useState<CollectionEntity[]>([]);

  // const { queue, consumer } = useSend();
  const { bleWrite } = useBLE();
  const [list, setList] = useState<Map<number, Set<string>>[]>([]);
  const getCollectionList = async () => {
    try {
      const client = await ClientRequest();
      const responseData = await client.collectionControllerGetCollectionList(
        userInfo?.id ?? '',
      );
      const collection = responseData.data
        .data as unknown as CollectionEntity[];
      console.log('collection', collection);
      const d = collection
        .sort(
          (a, b) =>
            new Date(
              dayjs(a.createAt).format('YYYY-MM-DD HH:mm:ss'),
            ).getTime() -
            new Date(dayjs(b.createAt).format('YYYY-MM-DD HH:mm:ss')).getTime(),
        )
        .map(collectionDetail => {
          const frameList = new Map<number, Set<string>>();
          (
            collectionDetail?.frameList as unknown as {
              selected: boolean;
              frame: string[];
            }[]
          ).forEach((element, index) => {
            frameList.set(index + 1, new Set([...element.frame]));
          });
          return frameList;
        });
      setList(d);

      setCollectionInfo(collection);
    } catch (e) {
      Toast.show(`${(e as Error).message}`);
    }
  };

  const handleDelete = async () => {
    try {
      setList(prev => {
        const m = prev.filter(v => {
          const i = deleteInfo?.frameIndex ?? 0;
          return !v.has(i);
        });
        return [...m];
      });
      const client = await ClientRequest();
      await client.collectionControllerDeleteCollection(
        deleteInfo?.collectionId ?? '',
      );
      await getCollectionList();
      modalDeleteRef.current?.closeModal();
      setCurrentStatus(false);

      // TODO 处理蓝牙
    } catch (e) {}
  };
  const handleDeleteEffects = (
    e: any,
    collectionId: string,
    frameIndex: number,
  ) => {
    e.stopPropagation();
    modalDeleteRef.current?.openModal();
    setDeleteInfo({ collectionId, frameIndex });
  };

  const { width } = useScreenSize();
  const handleEditLight = (collectionId: string) => {
    navigation.push('Drawer', { collectionId: collectionId });
  };
  useMount(() => {
    setTimeout(() => {
      getCollectionList();
    }, 300);
  });
  const data = covertCanUseCanvasData(drawData);
  const { queue, consumer } = useSend();
  const { run: handleSync } = useDebounceFn(() => {
    queue.enqueue('57e003ffff61');
    list.forEach((frameList, index) => {
      const collectionNum = index + 1;
      frameList.forEach((value, key) => {
        const item = Array.from(value).map(v => poi.get(v));
        console.log(
          `第${collectionNum}章 - frame${key}`,
          `57e0${getHex(item.length + 2)}00${getSimpleHex(
            collectionNum,
          )}${getSimpleHex(key)}${item.join('')}61`,
        );
        // 同步 预览亮 创建不亮
        // 问题：新编辑永远在第二个 1,2,3,4
        queue.enqueue(
          `57e0${getHex(item.length + 2)}00${getSimpleHex(
            collectionNum,
          )}${getSimpleHex(key)}${item.join('')}61`,
        );
      });
      if (collectionNum === list.length) {
        queue.enqueue(`57e00301${getSimpleHex(collectionNum)}061`);
      }
    });
    consumer.startConsuming(bleWrite);
  });
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(19, 20, 22, 1)',
        flexDirection: 'row',
      }}>
      <StatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          title={t('effect')}
          handlePress={back}
          extra={
            <TouchableWithoutFeedback
              onPress={() => setCurrentStatus(!currenStatus)}>
              <View>
                <Text style={{ color: '#fff' }}>
                  {currenStatus ? t('cancel') : t('edit')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          }
        />
        <ScrollView style={{ paddingHorizontal: 5, flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {collectionInfo?.map((itemData, index) => {
              const { frame } =
                (
                  itemData.frameList as unknown as {
                    selected: boolean;
                    frame: string[];
                  }[]
                ).find(v => v.selected) ?? {};
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => handleEditLight(itemData.id)}>
                  <View
                    style={{
                      borderRadius: 30,
                      height: 217,
                      backgroundColor: '#27282B',
                      width: (width - 15) / 2,
                      paddingHorizontal: 12,
                      paddingBottom: 16,
                      paddingTop: 12,
                      marginBottom: 5,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: 'rgba(118,118,118,0.1)',
                        borderRadius: 20,
                        position: 'relative',
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        {data.map((rows, r) => {
                          return (
                            <View
                              key={r}
                              style={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                justifyContent: 'center',
                              }}>
                              {rows.map((item, c) => {
                                return (
                                  <Items
                                    key={`${r}-${c}`}
                                    width={10}
                                    selected={!!frame?.includes(`${r}-${c}`)}
                                    a
                                  />
                                );
                              })}
                            </View>
                          );
                        })}
                      </View>
                      {currenStatus ? (
                        <TouchableWithoutFeedback
                          onPress={e =>
                            handleDeleteEffects(e, itemData.id, index)
                          }>
                          <View
                            style={{
                              width: 28,
                              height: 28,
                              position: 'absolute',
                              top: 0,
                              right: 0,
                            }}>
                            <Image
                              source={require('../../assets/light/delete-copy.png')}
                              alt="deleteIcon"
                              style={{ width: 28, height: 28 }}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      ) : null}
                    </View>
                    <View>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 14,
                          textAlign: 'center',
                          marginTop: 16,
                        }}>
                        {itemData.name}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
        <BlurModal
          ref={modalDeleteRef}
          title="Remove Device"
          content="Confirm device removal">
          <View
            style={{ display: 'flex', flexDirection: 'row', marginTop: 12 }}>
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
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: '#ffffff',
                  }}>
                  {t('cancel')}
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
                  style={{
                    color: '#FCE500',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  {t('confirm')}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </BlurModal>
        <TouchableHighlight
          onPress={handleSync}
          style={{
            position: 'absolute',
            left: 0,
            bottom: insets.bottom + 10,
            width: windowWidth,
            paddingHorizontal: 16,
            paddingVertical: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
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
            }}>
            <Text>同步</Text>
          </View>
        </TouchableHighlight>
      </SafeAreaView>
    </View>
  );
};
export default LightListNew;
