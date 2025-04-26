// src/services/api.js
import * as SecureStore from 'expo-secure-store';
import { URL } from '@env';

const BASE_URL = `${URL}:8000`;

export async function api(path, options = {}) {
  const token = await SecureStore.getItemAsync('access_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
