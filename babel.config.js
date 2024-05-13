module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@pages': './src/pages',
          '@assets': './src/assets',
          '@components': './src/components',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@stores': './src/stores',
          '@utils': './src/utils',
          '@locales': './src/locales',
          '@config': './src/config',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
