import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LaunchPage from "@/pages/Launch/LaunchPage";
import LoginPage from "@/pages/Login/LoginPage";
import RegisterPage from "@/pages/Register/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPassword/ForgotPasswordPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LaunchPage />} />
        <Route path="/giris" element={<LoginPage />} />
        <Route path="/uye-ol" element={<RegisterPage />} />
        <Route path="/sifremi-unuttum" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
