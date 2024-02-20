import { AxiosResponse, ResponseType } from 'axios';
import { Api } from './Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('access_token');
    if (value !== null) {
      return value;
    } else {
      return '';
    }
  } catch (error) {
    console.log('Error retrieving data: ', error);
  }
};
const ClientRequest = async () => {
  const token = await retrieveData();
  return new Api({
    headers: { Authorization: `Bearer ${token}` },
    baseURL: __DEV__
      ? 'http://localhost:3000/'
      : 'https://www.ski-api.gawtec.com/',
  });
};

export { ClientRequest };
