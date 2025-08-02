document.addEventListener('DOMContentLoaded', () => {
    const trackButton = document.getElementById('trackButton');
    const orderIdInput = document.getElementById('orderIdInput');
    const orderDetails = document.getElementById('orderDetails');

    trackButton.addEventListener('click', async () => {
        const orderId = orderIdInput.value.trim();
        if (!orderId) {
            alert('Please enter an order ID');
            return;
        }

        try {
            const orderDoc = await db.collection('orders').doc(orderId).get();
            
            if (!orderDoc.exists) {
                orderDetails.innerHTML = '<p class="error">Order not found</p>';
                orderDetails.classList.remove('hidden');
                return;
            }

            const order = orderDoc.data();
            orderDetails.innerHTML = `
                <h3>Order Details</h3>
                <p>Order ID: ${orderId}</p>
                <p>Status: ${order.status}</p>
                <p>Total Amount: $${order.amount}</p>
                <p>Paid Amount: $${order.paidAmount}</p>
                <p>Due Amount: $${order.amount - order.paidAmount}</p>
            `;
            orderDetails.classList.remove('hidden');
        } catch (error) {
            console.error('Error fetching order:', error);
            orderDetails.innerHTML = '<p class="error">Error fetching order details</p>';
            orderDetails.classList.remove('hidden');
        }
    });
});
