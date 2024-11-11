import { ReportData } from "../context/Context";
import { logger as _logger } from "../logger";
import { BaseController } from "./base";

class ReportController extends BaseController {
	private logger = _logger.with("[ReportController]");

	async load(): Promise<{ reports: ReportData[] }> {
		try {
			const res = await this.axiosInstance.get("/reports");

			const { reports } = res.data;

			this.logger.info(`Loaded Report List from the server`, { reports });

			return {
				reports
			}
		} catch (err: any) {
			this.logger.error("Error while trying to load reports", {
				error: err
			});

			return {
				reports: []
			}
		}
	}

	async create(report: ReportData): Promise<{ message: string; } | undefined> {
		try {
			await this.axiosInstance.post("/report", { ...report });
			this.logger.info(`Added new report`, { ...report });
		} catch (err: any) {
			this.logger.error("Error while trying to create report", {
				error: err
			});

			return {
				message: err.response.data.message || "Internal Application Error"
			}
		}
	}

	async edit(report: Partial<ReportData>): Promise<{ message: string; } | undefined> {
		try {
			await this.axiosInstance.put("/report", { ...report });
			this.logger.info(`Edited Report`, { ...report });
		} catch (err: any) {
			this.logger.error("Error while trying to edit report", {
				error: err
			});

			return {
				message: err.response.data.message || "Internal Application Error"
			}
		}
	}
}

export const reportController = new ReportController();