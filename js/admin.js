import { db } from './firebase-config.js';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginSection = document.getElementById('loginSection');
    const logoutBtn = document.getElementById('logoutBtn');
    const orderForm = document.getElementById('orderForm');
    const ordersList = document.getElementById('ordersList');
    const adminForm = document.getElementById('adminForm');
    const adminsList = document.getElementById('adminsList');

    let currentUser = null;

    // Login functionality
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('password').value;

        try {
            console.log('Login attempt:', email);
            const adminsRef = collection(db, 'admins');
            const q = query(adminsRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const adminDoc = querySnapshot.docs[0];
                const adminData = adminDoc.data();
                
                if (adminData.password === password) {
                    console.log('Login successful');
                    currentUser = { id: adminDoc.id, ...adminData };
                    
                    // Update visibility
                    loginSection.style.display = 'none';
                    adminDashboard.style.display = 'block';
                    
                    // Load data
                    await loadOrders();
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

    // Update logout to use style.display
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
                const due = order.amount - (order.paidAmount || 0);
                const orderElement = document.createElement('tr');
                orderElement.innerHTML = `
                    <td>${order.orderId}</td>
                    <td>${due.toLocaleString('bn-BD')} BDT</td>
                    <td>${order.status}</td>
                    <td>
                        <button onclick="window.editOrder('${doc.id}')">Edit</button>
                        <button onclick="window.deleteOrder('${doc.id}')">Delete</button>
                    </td>
                `;
                ordersList.appendChild(orderElement);
            });
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }

    // Update save order functionality
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const orderData = {
            orderId: document.getElementById('orderId').value.toUpperCase(),
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
                alert('Error deleting admin');

  
                console.error('Error deleting admin:', error);
                alert('Error deleting admin');
  
                console.error('Error deleting admin:', error);
                alert('Error deleting admin');
  
                console.error('Error deleting admin:', error);
                alert('Error deleting admin');

