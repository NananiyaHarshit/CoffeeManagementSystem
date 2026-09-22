import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoriteProvider } from './context/FavoriteContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <FavoriteProvider>
            <div className="flex min-h-screen flex-col bg-cream text-dark-espresso">
              <Navbar />
              <main className="flex-1">
                <AppRoutes />
              </main>
              <Footer />
            </div>
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </FavoriteProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
