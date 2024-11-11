import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { userMock } from "../mock/user";
import { couponMock } from "../mock/coupon";
import { reportMock } from "../mock/report";

export class BaseController {
	protected mock?: MockAdapter;

	protected axiosInstance = axios.create({
		baseURL: import.meta.env.VITE_API_URL,
	});

	constructor() {
		if (import.meta.env.VITE_MOCK_DATA) {
			this.mock = new MockAdapter(this.axiosInstance, { delayResponse: 600 });
			userMock.register(this.mock);
			couponMock.register(this.mock);
			reportMock.register(this.mock);
		}
	}
}

