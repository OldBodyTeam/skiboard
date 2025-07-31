# mv ./skiboard.keystore ./android/app
cd android
./gradlew clean
cd ..
watchman watch-del '/Users/bytedance/holiday/skiboard' ; watchman watch-project '/Users/bytedance/holiday/skiboard'
npm run build:android

cd android
# https://instamobile.io/android-development/generate-react-native-release-build-android/
./gradlew assembleRelease --info