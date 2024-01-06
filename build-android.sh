# mv ./skiboard.keystore ./android/app

npm run build:android

cd android
# https://instamobile.io/android-development/generate-react-native-release-build-android/
./gradlew assembleRelease --info