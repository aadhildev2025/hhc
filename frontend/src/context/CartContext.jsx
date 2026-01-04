import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existItem = prevItems.find((x) => x._id === product._id);
            const currentQty = existItem ? existItem.quantity : 0;
            const newQty = currentQty + quantity;

            if (newQty > product.stock) {
                const allowedQty = product.stock - currentQty;
                if (allowedQty <= 0) {
                    return prevItems;
                }
                return prevItems.map((x) =>
                    x._id === product._id ? { ...x, quantity: product.stock } : x
                );
            }

            if (existItem) {
                return prevItems.map((x) =>
                    x._id === product._id ? { ...x, quantity: newQty } : x
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
    };

    const updateQuantity = (id, quantity) => {
        setCartItems((prevItems) =>
            prevItems.map((x) => {
                if (x._id === id) {
                    const finalQty = Math.min(x.stock, Math.max(1, quantity));
                    return { ...x, quantity: finalQty };
                }
                return x;
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
