"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { AdminLoginSchema } from "@/schemas/visitorSchema"; //


export const useAdminLoginController = () => {
  const router = useRouter();

  
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(AdminLoginSchema),
    mode: "onTouched",
  });

  
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  
  const onLogin = handleSubmit(async (data) => {
    try {
      // Logic for authentication would go here
      console.log("Admin Data:", data);

     
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  });

  return {
    register,
    errors,
    isSubmitting,
    onLogin,
    showPassword, 
    togglePasswordVisibility, 
  };
};
