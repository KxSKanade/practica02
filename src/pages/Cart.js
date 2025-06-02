import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, increment, decrement } = useContext(CartContext);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  if (cart.length === 0 && !success) {
    return (
      <div className="p-6 bg-white min-h-screen text-black">
        <h1 className="text-3xl font-bold mb-6 text-center">Carrito</h1>
        <p className="text-center text-gray-600">Tu carrito está vacío.</p>
      </div>
    );
  }

  // Calcular total
  const total = cart.reduce((acc, item) => {
    const priceNum = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    return acc + priceNum * (item.quantity || 0);
  }, 0);

  const handleFinalize = () => {
    if (success) return; // evita múltiples clics
    setSuccess(true);

    // Después de 3 segundos, vaciar carrito y navegar a Home
    setTimeout(() => {
      cart.forEach((item) => removeFromCart(item.id));
      navigate('/');
    }, 3000);
  };

  return (
    <div className="p-6 bg-white min-h-screen text-black max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Carrito</h1>

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded text-center">
          ¡Compra finalizada con éxito! Serás redirigido a Home en unos segundos.
        </div>
      )}

      <div className="space-y-4">
        {cart.map((item) => {
          const priceNum = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between border border-gray-300 rounded-lg p-4 shadow-sm"
            >
              {/* Miniatura de producto */}
              <div className="flex items-center space-x-4">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">{item.name}</span>
                  <span className="text-gray-700">${priceNum.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => decrement(item.id)}
                  disabled={success}
                  className="w-8 h-8 flex items-center justify-center border border-black rounded hover:bg-gray-200 transition disabled:opacity-50"
                  aria-label={`Disminuir cantidad de ${item.name}`}
                >
                  −
                </button>

                <span className="w-6 text-center">{item.quantity}</span>

                <button
                  onClick={() => increment(item.id)}
                  disabled={success}
                  className="w-8 h-8 flex items-center justify-center border border-black rounded hover:bg-gray-200 transition disabled:opacity-50"
                  aria-label={`Aumentar cantidad de ${item.name}`}
                >
                  +
                </button>

                <button
                  onClick={() => removeFromCart(item.id)}
                  disabled={success}
                  className="ml-6 text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100 transition disabled:opacity-50"
                  aria-label={`Eliminar ${item.name} del carrito`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-end">
        <h2 className="text-2xl font-bold mb-4">
          Total: ${total.toFixed(2)}
        </h2>
        <button
          onClick={handleFinalize}
          disabled={success}
          className={`px-6 py-2 rounded ${
            success
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
          } transition-colors duration-300`}
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default Cart;
