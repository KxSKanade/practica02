// src/pages/Home.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaCartPlus } from 'react-icons/fa';

const Home = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // En producción React leerá esta variable de entorno:
    // si no existe (en dev) queda como cadena vacía
    const baseURL = process.env.REACT_APP_API_URL || '';

    axios
      .get(`${baseURL}/api/products`)
      .then((response) => {
        console.log('⚡ response.data:', response.data);
        // Extraemos el arreglo que está dentro de `data`
        const lista = response.data.data;
        if (Array.isArray(lista)) {
          setProducts(lista);
        } else {
          setError('La API devolvió una respuesta inesperada.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Hubo un problema al cargar los productos. Inténtalo más tarde.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [addToCart]);
  if (loading) {
    return (
      <p className="p-6 text-center text-lg text-gray-700">
        Cargando productos...
      </p>
    );
  }
  if (error) {
    return (
      <p className="p-6 text-center text-lg text-red-600">
        {error}
      </p>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-8 text-center">Productos</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay productos disponibles.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="overflow-hidden h-48">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col justify-between h-56">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg">${product.price}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors duration-300"
                  >
                    <FaCartPlus className="mr-1" />
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
