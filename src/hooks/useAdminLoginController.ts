"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import VisitService from "@/services/apidefinitions/visitService";
import { AdminLoginSchema } from "@/schemas/visitorSchema";

export const useAdminLoginController = () => {
  const ADMIN_TOKEN_KEY = "adminAccessToken";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null); // <-- added error state

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(AdminLoginSchema),
    mode: "onTouched",
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onLogin = handleSubmit(async (data) => {
    setLoginError(null); // clear previous error
    try {
      const response = await VisitService.AdminSignIn({
        email: data.Email,
        password: data.Password,
      });

      const token =
        response?.data?.accessToken ??
        response?.data?.token ??
        response?.accessToken ??
        response?.token;

      if (token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
      }

      router.push("/dashboard");
    } catch (error: any) {
      // Show backend error message if available
      const message =
        error.response?.data?.message || error.message || "Login failed";
      console.error("Admin login failed:", message);
      setLoginError(message); // set state so component can display
    }
  });

  return {
    register,
    errors,
    isSubmitting,
    onLogin,
    showPassword,
    togglePasswordVisibility,
    loginError, // <-- expose error to component
  };
};
