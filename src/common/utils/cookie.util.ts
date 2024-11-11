import { parse as cookieParse } from 'cookie-parse';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { COOKIE_FILE } from './constants';
// Updated import for consistency
import { parse as setCookieParse, Cookie } from 'set-cookie-parser';
import axios from 'axios';

export async function setCookie(cookieHeader: string): Promise<string> {
  try {
    const parsedCookies = cookieParse(cookieHeader);
    saveCookie(parsedCookies);
    console.info('Cookie set successfully');
    return 'Cookie set successfully';
  } catch (error) {
    console.error('Failed to set cookie:', error);
    throw new Error('Failed to set cookie');
  }
}

export function saveCookie(cookieData: Record<string, string>): void {
  try {
    if (existsSync(COOKIE_FILE)) {
      unlinkSync(COOKIE_FILE);
    }
    writeFileSync(COOKIE_FILE, JSON.stringify(cookieData), 'utf-8');
  } catch (error) {
    console.error('Failed to save cookie:', error);
    throw new Error('Failed to save cookie');
  }
}

export function getSavedCookie(): Record<string, string> | null {
  try {
    if (!existsSync(COOKIE_FILE)) {
      console.warn('No saved cookie file found');
      return null;
    }
    const cookieData = readFileSync(COOKIE_FILE, 'utf-8');
    return JSON.parse(cookieData) as Record<string, string>;
  } catch (error) {
    console.error('Failed to read saved cookie:', error);
    throw new Error('Failed to read saved cookie');
  }
}

export async function checkAndRefreshCookie(url: string): Promise<void> {
  try {
    const response = await axios.get(url);
    const setCookies = setCookieParse(response.headers['set-cookie'] || []);

    const savedCookies = getSavedCookie() || {};
    setCookies.forEach((cookie: Cookie) => {
      savedCookies[cookie.name] = cookie.value;
    });

    saveCookie(savedCookies);
  } catch (error) {
    console.error('Failed to refresh cookie:', error);
    throw new Error('Failed to refresh cookie');
  }
}
