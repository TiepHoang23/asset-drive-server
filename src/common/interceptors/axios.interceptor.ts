import axios from 'axios';
import { readFileSync } from 'fs';
import { COOKIE_FILE } from '../utils/constants';

axios.defaults.withCredentials = true;

const buildCookie = (): string => {
  const saved = JSON.parse(readFileSync(COOKIE_FILE, 'utf-8'));
  return Object.keys(saved)
    .map((key) => `${key}=${saved[key]}`)
    .join('; ');
};

axios.interceptors.request.use(
  (config) => {
    try {
      config.headers = config.headers;
      config.headers.Cookie = buildCookie();
      return config;
    } catch (e) {
      console.error(e);
      return Promise.reject('AXIOS ERROR');
    }
  },
  (error) => {
    console.error(error);
    return Promise.reject('AXIOS ERROR');
  },
);

export default axios;
