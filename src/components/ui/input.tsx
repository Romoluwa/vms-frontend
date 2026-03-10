import { ChangeEvent, InputHTMLAttributes } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type InputProps<T extends FieldValues> =
  InputHTMLAttributes<HTMLInputElement> & {
    register: UseFormRegister<T>;
    name: Path<T>;
    error?: FieldError;
    shouldCapitalize?: boolean;
  };

const capitalizeWords = (value: string) => {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const Input = <T extends FieldValues>({
  register,
  name,
  error,
  shouldCapitalize = true,
  onChange,
  ...props
}: InputProps<T>) => {
  const registerProps = register(name);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (shouldCapitalize) {
      e.target.value = capitalizeWords(e.target.value);
    }

    registerProps.onChange(e);
    onChange?.(e);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <input
        {...props}
        {...registerProps}
        onChange={handleChange}
        className={`p-4 border rounded-[12px] outline-none transition-all text-sm text-black caret-black placeholder:text-[#A1ACB2]
        ${
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-100 focus:border-[#2B4592]"
        } ${shouldCapitalize ? "capitalize" : ""}`}
      />

      {error && (
        <span className="text-red-500 text-[10px] font-bold uppercase">
          {error.message}
        </span>
      )}
    </div>
  );
};
