import Header from '@components/header/Header';
import DrawItem from '@pages/draw/DrawItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { covertCanUseCanvasData, covertMap } from '@utils/draw-config';
import { FC, PropsWithChildren, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMount } from 'ahooks';
import { getHex, getSimpleHex } from '@utils/hex';
import { useSend } from '@utils/send';
import useBLE from '@hooks/useBLE';
import { drawData, poi } from '@pages/draw/config';
import { Items } from '@pages/draw/Drawer';
type LightListProps = NativeStackScreenProps<RootStackParamList, 'LightList'> &
  PropsWithChildren<{ name?: string }>;
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
  const { queue, consumer } = useSend();
  const { bleWrite } = useBLE();
  const getCollectionList = async () => {
    try {
      console.log('xxx', userInfo?.id);
      const client = await ClientRequest();
      const responseData = await client.collectionControllerGetCollectionList(
        userInfo?.id ?? '',
      );
      const collection = responseData.data
        .data as unknown as CollectionEntity[];
      setCollectionInfo(collection);
      console.log(collection);
      collection?.forEach((item, index) => {
        const frameList = item.frameList as unknown as { frame: any[][] }[];
        frameList?.forEach((it, i) => {
          const frame = it.frame;
          const code = frame.map(key => poi.get(key));
          const pointer = `57e0${getHex(code.length / 2 + 2)}00${getSimpleHex(
            index,
          )}${getSimpleHex(i + 1)}${code}61`;
          queue.enqueue(pointer);
          console.log('************', pointer);
        });
      });
      consumer.startConsuming(bleWrite);
    } catch (e) {
      Toast.show(`${(e as Error).message}`);
    }
  };

  const handleDelete = async () => {
    try {
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
    navigation.push('EditLight', { collectionId: collectionId });
  };
  useMount(() => {
    getCollectionList();
  });
  const data = covertCanUseCanvasData(drawData);
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
      </SafeAreaView>
    </View>
  );
};
export default LightListNew;
