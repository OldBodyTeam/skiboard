import BlurModal, { BlurModalRef } from '@components/blur-Modal/BlurModal';
import { ClientRequest } from '@services/client';
import { useDeepCompareEffect } from 'ahooks';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export type HeaderProps = {
  handlePress: () => void;
  extra?: ReactNode;
  collectionId?: string;
  onChange: (title: string) => void;
  title: string;
};
const Header: FC<HeaderProps> = props => {
  const { handlePress, extra, collectionId, onChange, title: a } = props;
  const insets = useSafeAreaInsets();
  const modalEditRef = useRef<BlurModalRef>(null);
  const [title, setTitle] = useState(a ?? 'Smiling Face');
  useDeepCompareEffect(() => {
    setTitle(a);
  }, [a]);
  const handleEdit = async () => {
    modalEditRef.current?.closeModal();
    if (collectionId) {
      const client = await ClientRequest();
      await client.collectionControllerModifyCollection(collectionId, {
        name: title,
      });
    }
    console.log('*********', title);
    onChange(title);
  };

  return (
    <View
      style={{
        height: 74 + (Platform.OS === 'android' ? insets.top : 0),
        display: 'flex',
        justifyContent: extra ? 'space-between' : 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 16,
      }}>
      <View
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          position: 'absolute',
          left: 0,
          height: '100%',
          top: 0,
          paddingHorizontal: 16,
        }}>
        <TouchableOpacity
          style={{
            width: 41,
            height: 41,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 41,
            backgroundColor: 'rgba(255,255,255,0.15)',
          }}
          onPress={handlePress}>
          <Image
            source={require('../../assets/back.png')}
            style={{ width: 16, height: 16 }}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => modalEditRef.current?.openModal()}
        style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontWeight: '600', fontSize: 20, color: 'white' }}>
          {title}
        </Text>
        <Image
          source={require('../../assets/draw/edit.png')}
          style={{ width: 19, height: 22, marginLeft: 5 }}
        />
      </TouchableOpacity>

      <BlurModal
        ref={modalEditRef}
        title="Rename"
        content="Change Custom Name"
        mode="light">
        <View style={{ display: 'flex', marginTop: 8, width: '100%' }}>
          <View style={{ paddingLeft: 21, paddingRight: 21, width: '100%' }}>
            <TextInput
              placeholder="Change Custom Name"
              style={{
                height: 36,
                backgroundColor: 'rgba(245, 245, 245, 1)',
                borderRadius: 8,
                width: '100%',
                paddingLeft: 12,
                paddingRight: 12,
                color: 'rgba(195, 196, 198, 1)',
              }}
              onChange={e => setTitle(e.nativeEvent.text)}
            />
          </View>
          <Pressable style={{ flex: 1, marginTop: 12 }} onPress={handleEdit}>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
              }}>
              <Text
                style={{
                  color: 'rgba(89, 56, 236, 1)',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                Confirm
              </Text>
            </View>
          </Pressable>
        </View>
      </BlurModal>
    </View>
  );
};
export default Header;
