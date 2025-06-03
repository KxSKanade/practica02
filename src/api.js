const API_URL = process.env.REACT_APP_API_URL || "";

export function getProductos() {
  return fetch(`${API_URL}/productos`)
    .then(res => res.json());
}
