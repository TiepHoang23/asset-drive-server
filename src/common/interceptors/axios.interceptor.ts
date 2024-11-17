import axios from 'axios';
import { readFileSync } from 'fs';
import { COOKIE_FILE } from '../utils/constants';

axios.defaults.withCredentials = true;
const axiosInstance = axios.create();

const CONTENT_TYPE_FILES = [
  'application/octet-stream',
  'application/zip',
  'application/x-rar-compressed',
];
const isFileResponse = (contentType: string): boolean =>
  CONTENT_TYPE_FILES.includes(contentType);

const isHtmlResponse = (contentType: string): boolean =>
  contentType.includes('text/html');

export const buildCookie = (): string => {
  const saved = JSON.parse(readFileSync(COOKIE_FILE, 'utf-8'));
  return Object.keys(saved)
    .map((key) => `${key}=${saved[key]}`)
    .join('; ');
};

// Interceptor response
axiosInstance.interceptors.response.use(
  (response) => {
    const { url } = response.config;
    const contentType = response.headers['content-type'];

    if (isHtmlResponse(contentType)) {
      console.warn(`No file response: ${url}`);

      // response.config.headers.Cookie = buildCookie();
      // return response;
      return Promise.reject(response);
    }

    if (isFileResponse(contentType)) {
      return response;
    }

    console.warn(`No file response: ${url}`);
    return response;
  },
  (error) => {
    console.error('Error response:', error.message);
    return Promise.reject(error);
  },
);

export default axiosInstance;
