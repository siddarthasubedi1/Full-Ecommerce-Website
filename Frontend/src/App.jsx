import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import RegisterPage from "./pages/Registrations/RegisterPage";
import LoginPage from "./pages/Registrations/LoginPage";
import ProductPage from "./pages/product/ProductPage";
import HomePage from "./pages/HomePage";
import Navbar from "./pages/Navbar";
import { Footer } from "./pages/Footer";
import Aboutpage from "./pages/Aboutpage";
import Contactpage from "./pages/Contactpage";
import Cartpage from "./pages/Cartpage";
import ProductDetail from "./components/products/ProductDetailed";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProfilePage from "./pages/profile/ProfilePage";
import WishlistPage from "./pages/wishlist/WishlistPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/contact" element={<Contactpage />} />
        <Route path="/cart" element={<Cartpage />} />
        <Route path="/my-orders" element={<OrderHistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/productdetails/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;