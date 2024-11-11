import { useState } from "react";
import { Modal } from "./types";
import { toast } from "react-toastify";
import { userController } from "../../controllers/user";
import { CustomModal } from "./CustomModal";
import { Input } from "@nextui-org/react";
import { PasswordInput } from "../PasswordInput";

type UserData = {
	username: string;
	password: string;
	confirmPassword: string;
}

export const UserModal: React.FC<Modal> = ({ button, title, setLoading }) => {
	const [userData, setUserData] = useState<UserData>({
		username: "",
		password: "",
		confirmPassword: "",
	});

	const resetValues = () => {
		setUserData({ username: "", password: "", confirmPassword: "" });
	}

	const saveUser = async () => {
		if (!userData || !userData.username || !userData.password) {
			toast.error("Failed: Username and Password are required");
			return false;
		}

		if (userData.password !== userData.confirmPassword) {
			toast.error("Failed: Passwords do not match");
			return false;
		}

		setLoading(true);

		const res = await userController.create(userData.username, userData.password);

		setLoading(false);

		if (res.success) {
			toast.success("User created successfully");
			return true;
		}
		toast.error("Failed: " + res.message);
		return false;
	}

	return <>
		<CustomModal
			button={button}
			title={title}
			onSave={saveUser}
			resetParams={resetValues}
			acceptButtonType="save"
		>
			<div className="p-4 w-full flex flex-col space-y-4">
				<section>
					<label htmlFor="username" className="block text-sm dark:text-[#D1D5DB] font-medium text-gray-700">
						Username
					</label>
					<Input
						id="username"
						name="username"
						type="text"
						value={userData.username}
						onChange={(e) => setUserData({ ...userData, username: e.target.value })}
						placeholder="Enter your username"
						className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					/>
				</section>
				<section>
					<PasswordInput label="Password" id="password" value={userData.password} handleChange={(value) => setUserData({ ...userData, password: value })} />
				</section>
				<section>
					<PasswordInput label="Confirm Password" id="confirm-password" value={userData.confirmPassword} handleChange={(value) => setUserData({ ...userData, confirmPassword: value })} />
				</section>
			</div>
		</CustomModal>
	</>
}