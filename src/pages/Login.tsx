import { Input, Button, Spinner } from "@nextui-org/react";
import { FormEvent, useContext, useState } from "react";
import { userController } from "../controllers/user";
import { toast } from "react-toastify";
import { PasswordInput } from "../components/PasswordInput";
import { couponController } from "../controllers/coupon";
import useCustomNavigate from "../utils/useCustomNavigate";
import { reportController } from "../controllers/report";
import Context from "../context/Context";

export const Login: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);

	const { setLogged, setUsername, setCoupons, setReports } = useContext(Context);
	const navigate = useCustomNavigate();

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const username = formData.get("username") as string || "";
		const password = formData.get("login-password") as string || "";

		if (!username || !password) {
			toast.error("Failed: Missing login parameters");
			return;
		}

		setLoading(true);

		const res = await userController.login(username, password);

		if (res.success) {
			const couponResponse = await couponController.load();
			const reportResponse = await reportController.load();

			setCoupons(couponResponse.coupons);
			setReports(reportResponse.reports);
			navigate("/");

			setUsername(username);
			setLogged(res.success);
			toast.success("You have logged in successfully");
		} else {
			toast.error("Failed: Invalid username or password");
		}
		setLoading(false);
	};

	if (loading) {
		return <Spinner label="Loading..." color="primary" size="lg" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
	}

	return <>
		<article
			className="w-full max-w-sm max-h-min sm:max-w-md bg-white dark:bg-[#2d3b4f] mx-auto mt-32 p-6 sm:p-8 rounded-lg shadow-xl"
			aria-labelledby="login-heading"
		>
			<header>
				<h1 id="login-heading" className="text-2xl font-semibold text-center mb-6">Login</h1>
			</header>
			<form
				aria-labelledby="login-heading"
				className="space-y-4"
				onSubmit={handleLogin}
			>
				<section>
					<label htmlFor="username" className="block text-sm dark:text-[#D1D5DB] font-medium text-gray-700">
						Username
					</label>
					<Input
						id="username"
						name="username"
						type="text"
						required
						aria-required="true"
						placeholder="Enter your username"
						className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					/>
				</section>
				<section>
					<PasswordInput label="Password" id="login-password" />
				</section>
				<Button
					type="submit"
					className="w-full text-white font-semibold rounded-md mt-4"
					color="primary"
					aria-label="Login"
				>
					Login
				</Button>
			</form>
		</article>
	</>
}