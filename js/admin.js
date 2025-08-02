import { db } from './firebase-config.js';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    // Add initialization check
    if (!db) {
        console.error('Firebase DB not initialized');
        alert('Error: Database not connected');
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginSection = document.getElementById('loginSection');
    const logoutBtn = document.getElementById('logoutBtn');
    const orderForm = document.getElementById('orderForm');
    const ordersList = document.getElementById('ordersList');
    const adminForm = document.getElementById('adminForm');
    const adminsList = document.getElementById('adminsList');

    let currentUser = null;

    // Update login functionality
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('password').value;

        try {
            console.log('Attempting login...', email);
            const adminsRef = collection(db, 'admins');
            const q = query(adminsRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const adminDoc = querySnapshot.docs[0];
                const adminData = adminDoc.data();
                
                if (adminData.password === password) {
                    console.log('Login successful');
                    currentUser = { id: adminDoc.id, ...adminData };
                    document.getElementById('loginSection').style.display = 'none';
                    document.getElementById('adminDashboard').style.display = 'block';
                    await loadOrders();
                    await loadAdmins();
                } else {
                    alert('Invalid password');
                }
            } else {
                alert('Admin not found');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        adminDashboard.style.display = 'none';
        loginSection.style.display = 'block';
        loginForm.reset();
    });

    // Load and display orders
    async function loadOrders() {
        try {
            const ordersRef = collection(db, 'orders');
            const querySnapshot = await getDocs(ordersRef);
            ordersList.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const order = doc.data();
                const orderElement = document.createElement('div');
                orderElement.className = 'order-item';
                orderElement.innerHTML = `
                    <div>
                        <strong>Order ID:</strong> ${order.orderId || doc.id}
                        <br>
                        <strong>Customer:</strong> ${order.customerNumber}
                        <br>
                        <strong>Status:</strong> ${order.status}
                        <br>
                        <strong>Amount:</strong> $${order.amount}
                        <br>
                        <strong>Paid:</strong> $${order.paidAmount}
                    </div>
                    <div class="action-buttons">
                        <button onclick="window.editOrder('${doc.id}')">Edit</button>
                        <button onclick="window.deleteOrder('${doc.id}')">Delete</button>
                    </div>
                `;
                ordersList.appendChild(orderElement);
            });
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }

    // Save/Update order
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const orderData = {
            orderId: document.getElementById('orderId').value,
            customerNumber: document.getElementById('customerNumber').value,
            amount: parseFloat(document.getElementById('amount').value),
            paidAmount: parseFloat(document.getElementById('paidAmount').value),
            status: document.getElementById('status').value,
            lastUpdated: new Date().toISOString()
        };

        try {
            const orderRef = doc(db, 'orders', orderData.orderId);
            await setDoc(orderRef, orderData);
            console.log('Order saved successfully:', orderData);
            orderForm.reset();
            loadOrders();
        } catch (error) {
            console.error('Error saving order:', error);
            alert('Error saving order: ' + error.message);
        }
    });

    // Admin management
    async function loadAdmins() {
        try {
            const adminsRef = collection(db, 'admins');
            const querySnapshot = await getDocs(adminsRef);
            adminsList.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const admin = doc.data();
                const adminElement = document.createElement('div');
                adminElement.className = 'admin-item';
                adminElement.innerHTML = `
                    <div>
                        <strong>Email:</strong> ${admin.email}
                    </div>
                    <div class="action-buttons">
                        <button onclick="deleteAdmin('${doc.id}')">Delete</button>
                    </div>
                `;
                adminsList.appendChild(adminElement);
            });
        } catch (error) {
            console.error('Error loading admins:', error);
        }
    }

    // Add new admin
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const adminData = {
            email: document.getElementById('newEmail').value,
            password: document.getElementById('newPassword').value,
            createdAt: new Date().toISOString()
        };

        try {
            // Create a new document with auto-generated ID
            const adminsRef = collection(db, 'admins');
            const newAdminRef = doc(adminsRef);
            await setDoc(newAdminRef, adminData);
            adminForm.reset();
            loadAdmins();
        } catch (error) {
            console.error('Error adding admin:', error);
            alert('Error adding admin');
        }
    });

    // Helper functions
    window.editOrder = async (orderId) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            const orderSnap = await getDoc(orderRef);
            
            if (orderSnap.exists()) {
                const order = orderSnap.data();
                document.getElementById('orderId').value = orderId;
                document.getElementById('customerNumber').value = order.customerNumber;
                document.getElementById('amount').value = order.amount;
                document.getElementById('paidAmount').value = order.paidAmount;
                document.getElementById('status').value = order.status;
            }
        } catch (error) {
            console.error('Error editing order:', error);
        }
    };

    window.deleteOrder = async (orderId) => {
        if (confirm('Are you sure you want to delete this order?')) {
            try {
                const orderRef = doc(db, 'orders', orderId);
                await deleteDoc(orderRef);
                loadOrders();
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('Error deleting order');
            }
        }
    };

    window.deleteAdmin = async (adminId) => {
        if (confirm('Are you sure you want to delete this admin?')) {
            try {
                const adminsRef = collection(db, 'admins');
                const snapshot = await getDocs(adminsRef);
                if (snapshot.size <= 1) {
                    alert('Cannot delete the last admin');
                    return;
                }
                
                const adminRef = doc(db, 'admins', adminId);
                await deleteDoc(adminRef);
                loadAdmins();
            } catch (error) {
                console.error('Error deleting admin:', error);
                alert('Error deleting admin');
            }
        }
    };
});
                console.error('Error deleting admin:', error);
                alert('Error deleting admin');
            }
        }
    };
});
