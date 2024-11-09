import { MockRule } from "./types";
import MockAdapter from "axios-mock-adapter";

const defaultAdmin = {
	username: "admin",
	password: "admin"
}

class UserMock implements MockRule {
	register(mock: MockAdapter) {
		mock.onPost("/login").reply((config) => {
			const data = JSON.parse(config.data);

			if (data.username === defaultAdmin.username && data.password === defaultAdmin.password) {
				return [
					200,
					{
						success: true,
					},
				];
			}

			return [
				401,
				{
					success: false,
					message: "Invalid username or password",
				},
			];
		})

		mock.onGet("/status").reply(() => {
			return [
				200,
				{
					status: false
				}
			];
		});
	};
}

export const userMock = new UserMock();