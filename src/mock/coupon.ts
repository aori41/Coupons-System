import { CouponData } from "../context/Context";
import { MockRule } from "./types";
import MockAdapter from "axios-mock-adapter";

const coupons: CouponData[] = [
	{
		id: 1,
		code: "WELCOME24",
		canCombine: false,
		discountAmount: 30,
		discountType: "percent",
		description: "This coupon was created by mock data",
		limitUses: 0,
	},
	{
		id: 2,
		code: "WELCOME25",
		canCombine: true,
		discountAmount: 55,
		discountType: "ils",
		description: "This coupon was created by mock data",
		limitUses: 24,
	},
	{
		id: 3,
		code: "WELCOME26",
		canCombine: true,
		discountAmount: 15,
		discountType: "percent",
		description: "This coupon was created by mock data",
		limitUses: 0,
	},
	{
		id: 4,
		code: "WELCOME27",
		canCombine: true,
		discountAmount: 22,
		discountType: "ils",
		description: "This coupon was created by mock data",
		limitUses: 0,
	},
	{
		id: 5,
		code: "WELCOME28",
		canCombine: true,
		discountAmount: 30,
		discountType: "ils",
		description: "This coupon was created by mock data",
		limitUses: 0,
	},
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

		mock.onPost("/coupon").reply((config) => {
			const data = JSON.parse(config.data);

			const coupon = coupons.find((coupon) => coupon.code === data.code);
			if (coupon) {
				return [
					400,
					{
						message: "Coupon code already in use"
					}
				];
			}
			coupons.push(data);
			return [200, {}];
		});

		mock.onPost("/coupons/apply").reply((config) => {
			const data = JSON.parse(config.data);

			const couponIndex = coupons.findIndex(coupon => coupon.code === data.couponCode);

			if (couponIndex === -1) {
				return [
					404,
					{
						message: "Not a valid coupon"
					}
				];
			}

			const appliedCoupons = data.coupons.map((code: string) => coupons.find(coupon => coupon.code === code));

			const usedCouponIndex = appliedCoupons.findIndex((coupon: CouponData) => coupon.code === data.couponCode);
			if (usedCouponIndex !== -1) {
				return [
					400,
					{
						message: "Coupon code already applied"
					}
				];
			}

			const cantCombine = appliedCoupons.find((coupon: CouponData) => !coupon.canCombine);
			if (cantCombine) {
				return [
					400,
					{
						message: "You already used a coupon that cannot be combined with other coupons"
					}
				];
			}

			if (data.coupons.length && !coupons[couponIndex].canCombine) {
				return [
					400,
					{
						message: "This Coupon cannot be combined with other coupons"
					}
				];
			}

			const { discountAmount, discountType } = coupons[couponIndex];

			return [
				200,
				{
					discountAmount,
					discountType
				}
			];
		});

		mock.onPut("/coupon").reply((config) => {
			const data = JSON.parse(config.data);

			const couponIndex = coupons.findIndex((coupon) => coupon.id === data.id);

			if (couponIndex === -1) {
				return [
					404,
					{
						message: "Coupon not found"
					}
				];
			}

			coupons[couponIndex] = { ...coupons[couponIndex], ...data };
			return [200, {}];
		});

		mock.onDelete(/\/coupon\/.*/).reply((config) => {
			const id = config.url?.split("/").pop();

			if (!id) {
				return [
					400,
					{
						message: "Coupon is not exist"
					}
				];
			}

			const couponIndex = coupons.findIndex((coupon) => coupon.id === +id);

			if (couponIndex === -1) {
				return [
					404,
					{
						message: "Coupon not found"
					}
				];
			}

			coupons.splice(couponIndex, 1);
			return [200, {}];
		});
	};
}

export const couponMock = new CouponMock();