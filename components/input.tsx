import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegisterReturn;
  [key: string]: any;
}

export default function Input({
  name,
  type,
  placeholder,
  register,
  required = false,
  disabled = false,
  ...rest
}: InputProps) {
  return (
    <input
      className="w-full py-3 px-2 bg-transparent border border-gray-500 rounded-md text-lg text-white"
      {...register}
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      {...rest}
    />
  );
}
