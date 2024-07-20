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
  const api = new Api();

  return api;
};

export { ClientRequest };
