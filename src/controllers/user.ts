import { logger as _logger } from "../logger";
import { BaseController } from "./base";

class UserController extends BaseController {
	private logger = _logger.with("[UserController]");

	async login(username: string, password: string): Promise<{ success: boolean; message: string; }> {
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

	async create(username: string, password: string): Promise<{ success: boolean; message: string; }> {
		try {
			const res = await this.axiosInstance.post("/user", {
				username,
				password
			});

			const { success, message } = res.data;

			this.logger.info(`User Created ${success ? "Successfully" : "UnSuccessfully"}`, {
				success,
				message
			});

			return {
				success,
				message
			}
		} catch (err: any) {
			this.logger.error("Error while trying to create user", {
				error: err
			});

			return {
				success: false,
				message: err.response.data.message || "Internal Application Error"
			}
		}
	}

	async status(): Promise<{ status: boolean; username?: string; }> {
		try {
			const res = await this.axiosInstance.get("/status");

			const { status, username } = res.data;

			this.logger.info(`User is Logged ${status ? "In" : "Out"}`, {
				status
			});

			return {
				status,
				username
			}
		} catch (err: any) {
			this.logger.error("Error while trying to get user status", {
				error: err
			});

			return {
				status: false
			}
		}
	}
}

export const userController = new UserController();