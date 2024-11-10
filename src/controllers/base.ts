import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { userMock } from "../mock/user";

export class BaseController {
	protected mock?: MockAdapter;

	protected axiosInstance = axios.create({
		baseURL: import.meta.env.VITE_API_URL,
	});

	constructor() {
		if (import.meta.env.VITE_MOCK_DATA) {
			this.mock = new MockAdapter(this.axiosInstance, { delayResponse: 1000 });
			userMock.register(this.mock);
		}
	}
}

