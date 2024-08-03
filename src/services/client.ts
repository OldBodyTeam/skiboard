import { Api } from './Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClientRequest = async () => {
  const api = new Api();

  return api;
};

export { ClientRequest };
