import { logger as _logger } from "../logger";
import { BaseController } from "./base";

class CouponController extends BaseController {
	private logger = _logger.with("[CouponController]");

	async load() {
		try {
			const res = await this.axiosInstance.get("/load-coupons");

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
}

export const couponController = new CouponController();