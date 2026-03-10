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

// Keep your original for registration if needed
export const AdminLoginSchema = yup
  .object({
    Email: yup.string().email("Invalid email").required("Email is required"),
    Password: yup.string().required("Please enter your password"),
  })
  .required();
  
export type AdminLoginSchema = yup.InferType<typeof AdminLoginSchema>;

export const adminCreateAccountSchema = yup.object().shape({
  firstName: yup.string().trim().required("FIRST NAME IS REQUIRED"),

  lastName: yup.string().trim().required("LAST NAME IS REQUIRED"),

  email: yup
    .string()
    .email("INVALID EMAIL ADDRESS")
    .trim()
    .lowercase()
    .required("EMAIL IS REQUIRED"),

  password: yup
    .string()
    .required("PASSWORD IS REQUIRED")
    .min(8, "PASSWORD MUST BE AT LEAST 8 CHARACTERS")
    .matches(/[A-Z]/, "PASSWORD MUST CONTAIN AT LEAST ONE UPPERCASE LETTER")
    .matches(/[0-9]/, "PASSWORD MUST CONTAIN AT LEAST ONE NUMBER"),

  confirmPassword: yup
    .string()
    .required("PLEASE CONFIRM YOUR PASSWORD")
    .oneOf([yup.ref("password")], "PASSWORDS MUST MATCH"),
});

export type AdminCreateAccountValues = yup.InferType<
  typeof adminCreateAccountSchema
>;
