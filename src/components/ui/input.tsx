import { InputHTMLAttributes } from "react";
import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

type InputProps<T extends FieldValues> = InputHTMLAttributes<HTMLInputElement> & {
  register: UseFormRegister<T>;
  name: Path<T>;
  error?: FieldError;
};

export const Input = <T extends FieldValues>({
  register,
  name,
  error,
  ...props
}: InputProps<T>) => (
  <div className="flex flex-col gap-2 w-full">
    <input
      {...register(name)}
      {...props}
      className={`p-4 border rounded-[12px] outline-none transition-all text-sm text-black caret-black placeholder:text-[#A1ACB2]
        ${error ? "border-red-500 bg-red-50" : "border-gray-100 focus:border-[#2B4592]"}`}
    />
    {error && (
      <span className="text-red-500 text-[10px] font-bold uppercase">
        {error.message}
      </span>
    )}
  </div>
);
