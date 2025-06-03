// src/api.js
const baseURL =
  process.env.NODE_ENV === "development"
    ? ""                      // en dev usa proxy
    : process.env.REACT_APP_API_URL; // en prod usa la URL real

export function getProductos() {
  return fetch(
    process.env.NODE_ENV === "development"
      ? "/productos"
      : `${baseURL}/productos`
  ).then(res => res.json());
}
