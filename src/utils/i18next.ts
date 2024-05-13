import i18next, { ModuleType } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lngKey = '@lng';

const languageDetector = {
  compatibilityJSON: 'v3',
  type: 'languageDetector' as ModuleType,
  async: true,
  detect: async (callback: Function) => {
    const lang = (await AsyncStorage.getItem(lngKey)) || 'locale';
    if (lang === 'locale') {
      callback(getSystemLanguage());
    } else {
      callback(lang);
    }
  },
};

// 初始化i18next配置
i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh', // 切换语言失败时的使用的语言
    debug: __DEV__, // 开发环境开启调试
    // 资源文件
    resources: {
      en: {
        translation: require('./../locales/en-US.json'),
      },
      zh: {
        translation: require('./../locales/zh-CN.json'),
      },
    },
    react: {
      useSuspense: false,
    },
  });

/**
 * 获取当前系统语言
 * @returns
 */
export const getSystemLanguage = (): string => {
  const locales = RNLocalize.getLocales();
  return locales[0].languageCode;
};

/**
 * 切换语言
 * @param lng
 */
export const changeLanguage = async (lng: 'en' | 'zh' | 'locale') => {
  // 切换语言
  await i18next.changeLanguage(lng === 'locale' ? getSystemLanguage() : lng);
  // 持久化当前选择
  await AsyncStorage.setItem(lngKey, lng);
};

export default i18next;
