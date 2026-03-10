import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ProductProvider } from './Context/UseContext.jsx';
import { SidebarDataProvider } from './Context/SidebarDataContext.jsx';
import { AuthProvider } from './Context/GoogleAuth.jsx'; // ✅ ঠিক এটাকে ইমপোর্ট করো

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProductProvider>
        <SidebarDataProvider>
          <App />
        </SidebarDataProvider>
      </ProductProvider>
    </AuthProvider>
  </StrictMode>
);



