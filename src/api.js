// src/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // ya definido en .env.production

export const api = axios.create({
  baseURL: `${API_URL}/api`, // apuntamos directamente a /api
  // si tu backend necesita headers o tokens, agrégalos aquí
});
