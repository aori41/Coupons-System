import { CouponData } from "../context/Context";
import { MockRule } from "./types";
import MockAdapter from "axios-mock-adapter";

const coupons: CouponData[] = [
	{
		code: "XVOG5A",
		canCombine: false,
		discountAmount: 30,
		discountType: "percent",
		description: "",
		limitUses: "0",
	}
];

class CouponMock implements MockRule {
	register(mock: MockAdapter) {
		mock.onGet("/coupons").reply(() => {
			return [
				200,
				{
					coupons
				}
			];
		});
	};
}

export const couponMock = new CouponMock();