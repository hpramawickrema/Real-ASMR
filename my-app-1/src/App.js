import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoUploadForm from './VideoUploadForm';
import './App.css';
import VideoGallery from "./VideoGallery";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import HomePage from "./Home";
import UserList from './UserList';
import CreateArticle from './CreateArticle';
import ShowVideoPage from './ShowVideoPage';
import ViewArticle from './ViewArticle';
import Marketplace from './Marketplace';
import LogoutPage from "./LogoutPage";
import UserProfile from "./UserProfile";
import AddProductPage from "./AddProductPage";
import ManageProductsPage from "./AddProductPage";
import ViewProductsPage from "./ViewProductsPage";
import BuyProductPage from "./BuyProduct";
import OrderHistoryPage from "./OrderHistory";
import AdminOrderManager from "./AdminOrderManage";
import ViewArticlePage from "./ViewArticle";
import AdminLoginPage from "./AdminLoginPage";
import AdminRegisterPage from "./AdminRegisterPage";

function App() {
  return (
      <Router>
          <div className="min-h-screen bg-gray-100 px-4">
              <Routes>
                  <Route path="/upload" element={<VideoUploadForm />} />
                  <Route path="/view" element={<VideoGallery />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/articles" element={<CreateArticle />} />
                  <Route path="/show/:id" element={<ShowVideoPage />} />
                  <Route path="view/articles/:id" element={<ViewArticlePage />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/logout" element={<LogoutPage />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/products/add" element={<ManageProductsPage />} />
                  <Route path="/item" element={<ViewProductsPage />} />
                  <Route path="/buy" element={<BuyProductPage />} />
                  <Route path="/order" element={<OrderHistoryPage />} />
                  <Route path="/order/manage" element={<AdminOrderManager />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin/register" element={<AdminRegisterPage />} />

              </Routes>
          </div>
      </Router>

  );
}

export default App;