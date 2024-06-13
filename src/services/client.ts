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
  const axios = new Api({
    headers: { Authorization: `Bearer ${token}` },
    baseURL: __DEV__
      ? 'https://www.ski-api.gawtec.com/'
      : 'https://www.ski-api.gawtec.com/',
  });
  axios.instance.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    },
  );
  return axios;
};

export { ClientRequest };
