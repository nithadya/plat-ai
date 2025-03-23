import { createContext, useEffect, useState } from "react";
import { food_list as defaultFoodList, menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = "http://localhost:4000";
    const [food_list, setFoodList] = useState(defaultFoodList);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const currency = "LKR";
    const deliveryCharge = 500;

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            try {
                const response = await axios.post(
                    `${url}/api/cart/add`,
                    { itemId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!response.data.success) {
                    console.error("Failed to add to cart on server:", response.data.message);
                }
            } catch (error) {
                console.error("Error adding to cart:", error.response?.data || error.message);
            }
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const newCount = (prev[itemId] || 0) - 1;
            if (newCount <= 0) {
                const { [itemId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [itemId]: newCount };
        });
        if (token) {
            try {
                const response = await axios.post(
                    `${url}/api/cart/remove`,
                    { itemId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!response.data.success) {
                    console.error("Failed to remove from cart on server:", response.data.message);
                }
            } catch (error) {
                console.error("Error removing from cart:", error.response?.data || error.message);
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoodList(response.data.data || defaultFoodList);
        } catch (error) {
            console.error("Error fetching food list:", error.response?.data || error.message);
            setFoodList(defaultFoodList);
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(
                `${url}/api/cart/get`,
                {}, // No need for userId in body; backend uses req.userId
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            } else {
                console.error("Failed to load cart data:", response.data.message);
                setCartItems({}); // Reset to empty on failure
            }
        } catch (error) {
            console.error("Error loading cart data:", error.response?.data || error.message);
            setCartItems({}); // Reset to empty on error
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (token) {
                await loadCartData(token);
            }
        }
        loadData();
    }, [token]);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;