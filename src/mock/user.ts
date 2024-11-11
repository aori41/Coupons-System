import { MockRule } from "./types";
import MockAdapter from "axios-mock-adapter";

const defaultAdmin = {
	username: "admin",
	password: "admin"
}

const users = [defaultAdmin];

class UserMock implements MockRule {
	register(mock: MockAdapter) {
		mock.onGet("/users").reply(() => {
			const usernames = users.map(user => user.username);

			return [
				200,
				{
					users: usernames
				}
			];
		});


		mock.onPost("/login").reply((config) => {
			const data = JSON.parse(config.data);

			const user = users.find(user => user.username === data.username);

			if (!user || (user && user.password !== data.password)) {
				return [
					401,
					{
						success: false,
						message: "Invalid username or password",
					},
				];
			}

			return [
				200,
				{
					success: true,
				},
			];
		})

		mock.onPost("/user").reply((config) => {
			const data = JSON.parse(config.data);

			const duplicates = users.filter(user => user.username === data.username);

			if (duplicates.length) {
				return [
					400,
					{
						success: false,
						message: "Username already exists",
					},
				];
			}

			users.push({ username: data.username, password: data.password });
			return [
				200,
				{
					success: true,
				},
			]
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