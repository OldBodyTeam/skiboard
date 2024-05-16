import React, {
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'react-native-ui-lib';
import { TIME } from '@pages/music-screen/config';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useTranslation } from 'react-i18next';
const secondsList = Array(60)
  .fill(1)
  .map((_i, index) => {
    return { id: index < 10 ? '0' + index : index + '', num: index };
  });

const AMHoursList = Array(12)
  .fill(1)
  .map((_i, index) => {
    return {
      id: index < 10 ? '0' + index : index + '',
      num: index,
    };
  });
export type PickerModalRef = {
  openModal: () => void;
  closeModal: () => void;
};
export type BlurModalProps = {
  // type: TIME;
  handleCurrentSelectedTime: (chooseTime: {
    currentTime: [number, string];
    time: TIME;
  }) => void; // 选择当前时间
};
const PickerModal = forwardRef<
  PickerModalRef,
  PropsWithChildren<BlurModalProps>
>((props, ref) => {
  const { handleCurrentSelectedTime } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTimeMode, setSelectedTimeMode] = useState<TIME>(TIME.AM);
  const handleMode = (time: TIME) => {
    setSelectedTimeMode(time);
  };
  useImperativeHandle(
    ref,
    () => {
      return {
        openModal: () => setModalVisible(true),
        closeModal: () => setModalVisible(false),
      };
    },
    [setModalVisible],
  );
  const hourRef = useRef<ICarouselInstance>(null);
  const minRef = useRef<ICarouselInstance>(null);
  const handleSaveOpt = () => {
    const hours = hourRef.current?.getCurrentIndex();
    const mins = minRef.current?.getCurrentIndex();
    handleCurrentSelectedTime({
      currentTime: [AMHoursList[hours!].num, secondsList[mins!].id],
      time: selectedTimeMode,
    });
  };
  const { t } = useTranslation();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      onRequestClose={() => setModalVisible(false)}>
      <Pressable
        onPress={() => setModalVisible(false)}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}>
        <BlurView
          style={{ flex: 1 }}
          tint="systemThinMaterialDark"
          blurReductionFactor={10}
          experimentalBlurMethod="dimezisBlurView"
        />
      </Pressable>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: 420,
          borderRadius: 30,
          overflow: 'hidden',
          left: 0,
          bottom: 24,
        }}>
        <BlurView
          intensity={100}
          style={styles.blurContainer}
          tint="dark"
          blurReductionFactor={10}
          experimentalBlurMethod="dimezisBlurView">
          <View
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              width: '100%',
              height: 184,
            }}>
            <Image
              source={require('../../assets/music/top-blur.png')}
              style={{
                width: '100%',
                height: 184,
              }}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              pointerEvents: 'none',
              zIndex: 1,
              width: '100%',
              height: 295,
            }}>
            <Image
              source={require('../../assets/music/bottom-blur.png')}
              style={{
                width: '100%',
                height: 295,
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: 'rgba(118, 118, 118, 0.4)',
              height: 4,
              borderRadius: 2,
              width: 40,
              marginTop: 8,
              marginBottom: 24,
              position: 'relative',
              zIndex: 1,
            }}
          />
          <View
            style={{
              backgroundColor: 'rgba(118, 118, 118, 0.19)',
              height: 44,
              borderRadius: 14,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 4,
              position: 'relative',
              zIndex: 1,
            }}>
            <Pressable onPress={() => handleMode(TIME.AM)}>
              <View
                style={{
                  height: 36,
                  width: 45,
                  backgroundColor:
                    selectedTimeMode === TIME.AM
                      ? '#25262B'
                      : 'rgba(118, 118, 118, 0.19)',
                  borderRadius: 9,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 19 / 2,
                }}>
                <Text style={{ color: 'white' }}>{t('am')}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => handleMode(TIME.PM)}>
              <View
                style={{
                  height: 36,
                  width: 45,
                  backgroundColor:
                    selectedTimeMode === TIME.PM
                      ? '#25262B'
                      : 'rgba(118, 118, 118, 0.19)',
                  borderRadius: 9,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ color: 'white' }}>{t('pm')}</Text>
              </View>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              height: 78 * 3,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <View style={{ width: 76 }}>
              <Carousel
                ref={hourRef}
                loop={false}
                autoPlayInterval={0}
                style={{
                  height: 78 * 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                data={AMHoursList}
                height={78}
                vertical
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      key={item.id}>
                      <Text style={{ fontSize: 65, color: 'white' }}>
                        {item.id}
                      </Text>
                    </View>
                  );
                }}
                autoPlay={false}
              />
            </View>

            <View
              style={{
                height: 78,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontSize: 65, color: 'white' }}>:</Text>
            </View>
            <View style={{ width: 76 }}>
              <Carousel
                ref={minRef}
                loop={false}
                autoPlayInterval={0}
                style={{
                  height: 78 * 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                data={secondsList}
                height={78}
                vertical
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      key={item.id}>
                      <Text style={{ fontSize: 65, color: 'white' }}>
                        {item.id}
                      </Text>
                    </View>
                  );
                }}
                autoPlay={false}
              />
              {/* <FlatList
                data={secondsList}
                renderItem={({ item }) => {
                  return (
                    <View style={{ height: 78 }}>
                      <Text style={{ fontSize: 65, color: 'white' }}>
                        {item.id}
                      </Text>
                    </View>
                  );
                }}
              /> */}
            </View>
          </View>
          <Pressable
            onPress={handleSaveOpt}
            style={{ position: 'relative', zIndex: 1 }}>
            <View
              style={{
                width: 106,
                height: 55,
                backgroundColor: 'white',
                borderRadius: 29,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontWeight: '600', color: '#333333' }}>
                {t('Save')}
              </Text>
            </View>
          </Pressable>
        </BlurView>
      </View>
    </Modal>
  );
});
const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 10,
    textAlign: 'center',
    overflow: 'hidden',
    borderRadius: 20,
    alignItems: 'center',
  },
});
export default PickerModal;
