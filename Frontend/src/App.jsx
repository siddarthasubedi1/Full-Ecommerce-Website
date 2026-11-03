import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router";

import RegisterPage from "./pages/Registrations/RegisterPage";
import LoginPage from "./pages/Registrations/LoginPage";
import ProductPage from "./pages/product/ProductPage";
import HomePage from "./pages/HomePage";
import Navbar from "./pages/Navbar";
import { Footer } from "./pages/Footer";
import Aboutpage from "./pages/Aboutpage";
import Contactpage from "./pages/Contactpage";
import Cartpage from "./pages/Cartpage";

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
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;