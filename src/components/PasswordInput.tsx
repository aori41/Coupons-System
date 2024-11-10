import { Button, Input } from "@nextui-org/react";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

type Props = {
	label: string;
	id: string;
	value?: string;
	handleChange?: (value: string) => void;
}

export const PasswordInput: React.FC<Props> = ({ label, id, value, handleChange }) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prevState) => !prevState);
	};

	return <>
		<label
			htmlFor={id}
			className="block text-sm dark:text-[#D1D5DB] font-medium text-gray-700"
		>
			{label}
		</label>
		<div className="relative">
			<Input
				id={id}
				name={id}
				type={showPassword ? 'text' : 'password'}
				value={value}
				onChange={(e) => handleChange && handleChange(e.target.value)}
				placeholder="Enter your password"
				className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
			/>
			<Button
				size="sm"
				isIconOnly
				onClick={togglePasswordVisibility}
				className="absolute bg-transparent z-10 right-1 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
				aria-label={showPassword ? 'Hide password' : 'Show password'}
			>
				{showPassword ? <EyeClosed /> : <Eye />}
			</Button>
		</div>
	</>
}