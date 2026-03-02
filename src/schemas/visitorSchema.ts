import * as yup from "yup";

export const signInSchema = yup
  .object({
    visitorName: yup.string().required("Enter your full name"),
    phoneNumber: yup.string().required("Phone number is required"),
    hostName: yup.string().required("Who are you here to see?"),
    department: yup.string().required("Select a department"),
    purposeOfVisit: yup.string().required("State your purpose"),
    laptopModel: yup.string(),
    laptopSerialNumber: yup.string(),
    signature: yup.string().required("Signature is required to sign in"),
  })
  .required();

export type SignInFormValues = yup.InferType<typeof signInSchema>;

export const signOutSchema = yup
  .object({
    visitorName: yup.string().required("Please enter your name to sign out"),
    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .matches(/^\+?\d{10,15}$/, "Phone number must be valid"),
    signature: yup.string().required("Signature is required for confirmation"),
  })
  .required();

export type SignOutFormValues = yup.InferType<typeof signOutSchema>;

export const AdminLoginSchema = yup
  .object({
    Email: yup.string().email("Invalid email").required("Email is required"),
    Password: yup.string().required("Please enter your password"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("Password")], "Passwords must match")
      .required("Please confirm your password"),
  })
  .required();
