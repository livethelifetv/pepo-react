import { API_ROOT } from '../constants/index';
import AsyncStorage from '@react-native-community/async-storage';

export default class PepoApi {
  constructor(url, params) {
    this.url = url;
    this.params = params;
    this.cleanUrl();
  }

  cleanUrl() {
    this.cleanedUrl = this.url.startsWith('http') ? this.url : `${API_ROOT}${this.url}`;
  }

  fetch(navigate) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await fetch(this.cleanedUrl, this.params);
        let responseJSON = await response.json();
        console.log('responseJSON for request:', responseJSON);
        if (response.status == 401) {
          console.log('Request status: 401');
          AsyncStorage.removeItem('user', () => {
            navigate('AuthScreen');
          });
          return;
        } else if (response.status == 500 || response.status == 302) {
          responseJSON.msg = 'Something went wrong';
        }
        return resolve(responseJSON);
      } catch (err) {
        console.log('Catched the exception:', err);
        err = { err: String(err), msg: 'Something went wrong' };
        return reject(err);
      }
    });
  }
}