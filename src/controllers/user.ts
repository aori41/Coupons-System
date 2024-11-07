import { logger as _logger } from "../utils/logger";
import { BaseController } from "./base";

class UserController extends BaseController {
	private logger = _logger.with("[UserController]");

	async login(username: string, password: string) {
		try {
			const res = await this.axiosInstance.post("/login", {
				username,
				password
			});

			const { success, message } = res.data;

			this.logger.info(`User Logged in ${success ? "Successfully" : "UnSuccessfully"}`, {
				success,
				message
			});

			return {
				success,
				message
			}
		} catch (err: any) {
			this.logger.error("Error while trying to login", {
				error: err
			});

			return {
				success: false,
				message: err.message || "Internal Application Error"
			}
		}
	}
}

export const userController = new UserController();