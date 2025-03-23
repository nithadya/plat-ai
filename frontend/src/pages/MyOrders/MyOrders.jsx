import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyOrders = () => {
    const [data, setData] = useState([]);
    const { url, token, currency } = useContext(StoreContext);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        if (!token) {
            toast.error("Please sign in to view your orders.");
            navigate('/cart'); // Or '/login'
            return;
        }

        try {
            console.log("Fetching orders with token:", token); // Debug token
            const response = await axios.post(
                `${url}/api/order/userorders`,
                {}, // No body needed since userId comes from token
                { headers: { Authorization: `Bearer ${token}` } } // Correct header format
            );
            if (response.data.success) {
                setData(response.data.data);
            } else {
                toast.error("Failed to fetch orders: " + response.data.message);
            }
        } catch (error) {
            console.error("Fetch Orders Error:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error("Unauthorized: Please sign in again.");
                localStorage.removeItem("token"); // Clear invalid token
                navigate('/cart'); // Or '/login'
            } else {
                toast.error("An error occurred while fetching orders.");
            }
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className='my-orders-order'>
                        <img src={assets.parcel_icon} alt="" />
                        <p>
                            {order.items.map((item, index) => {
                                if (index === order.items.length - 1) {
                                    return `${item.name} x ${item.quantity}`;
                                } else {
                                    return `${item.name} x ${item.quantity}, `;
                                }
                            })}
                        </p>
                        <p>{currency}{order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>●</span> <b>{order.status}</b></p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;