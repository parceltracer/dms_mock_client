import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/orders')
      .then(res => setOrders(res.data))
      .catch(console.error);
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Location</th>
          <th>Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>{order.order_id}</td>
            <td>{order.customer_name}</td>
            <td>{order.customer_phone}</td>
            <td>
              <span className={`status-${order.delivery_state.toLowerCase()}`}>
                {order.delivery_state}
              </span>
            </td>
            <td>
              {order.area_district} ({order.area_name})
            </td>
            <td>
              {new Date(order.last_updated_at).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;