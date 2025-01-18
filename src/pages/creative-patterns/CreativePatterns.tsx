import Header from '@components/header/Header';
import DrawItem from '@pages/draw/DrawItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { covertCanUseCanvasData, covertMap } from '@utils/draw-config';
import { FC, PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RootStackParamList } from 'route.config';
import React from 'react';
import { useScreenSize } from '@hooks/useScreenSize';
import { ClientRequest } from '@services/client';
import Toast from 'react-native-root-toast';

import { CollectionEntity } from '@services/data-contracts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMount } from 'ahooks';
import { get } from 'lodash';
import { drawData } from '@pages/draw/config';
import { Items } from '@pages/draw/Drawer';
type CreativePatternsProps = NativeStackScreenProps<
  RootStackParamList,
  'CreativePatterns'
> &
  PropsWithChildren<{ name?: string }>;
const CreativePatterns: FC<CreativePatternsProps> = props => {
  const { t } = useTranslation();
  const { navigation } = props;
  const back = () => {
    navigation.navigate('Home', { screen: 'DesignScreen' });
  };
  const [collectionInfo, setCollectionInfo] = useState<CollectionEntity[]>([]);
  const getCollectionList = async () => {
    try {
      const client = await ClientRequest();
      const responseData =
        await client.collectionControllerGetCollectionAllList({
          pageSize: 1,
          pageNumber: 100,
        });
      const collection = get(
        responseData,
        'data.data.data',
      ) as unknown as CollectionEntity[];
      setCollectionInfo(collection);
    } catch (e) {
      Toast.show((e as Error).message);
      console.log(e);
    }
  };

  const { width } = useScreenSize();
  const handleEditLight = (collectionId: string) => {
    console.log(collectionId);
    navigation.push('Drawer', { collectionId: collectionId });
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
        <Header title={t('creative-patterns')} handlePress={back} />
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
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default CreativePatterns;
