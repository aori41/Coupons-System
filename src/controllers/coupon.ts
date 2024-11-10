import { CouponData } from "../context/Context";
import { logger as _logger } from "../logger";
import { BaseController } from "./base";

class CouponController extends BaseController {
	private logger = _logger.with("[CouponController]");

	async load(): Promise<{ coupons: CouponData[] }> {
		try {
			const res = await this.axiosInstance.get("/coupons");

			const { coupons } = res.data;

			this.logger.info(`Loaded Coupon List from the server`, { coupons });

			return {
				coupons
			}
		} catch (err: any) {
			this.logger.error("Error while trying to load coupons", {
				error: err
			});

			return {
				coupons: []
			}
		}
	}

	async create(coupon: CouponData) {
		try {
			await this.axiosInstance.post("/coupon", { ...coupon });
			this.logger.info(`Added new Coupon`, { ...coupon });
		} catch (err: any) {
			this.logger.error("Error while trying to create coupon", {
				error: err
			});

			return {
				message: err.response.data.message || "Internal Application Error"
			}
		}
	}
}

export const couponController = new CouponController();