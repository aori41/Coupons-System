import { ReportData } from "../context/Context";
import { MockRule } from "./types";
import MockAdapter from "axios-mock-adapter";

const reports: ReportData[] = [
	{
		couponId: 1,
		couponCode: "WELCOME24",
		createdBy: "admin",
		createdAt: Date.now() - 100000000,
		lastModified: Date.now() - 100000000,
		lastModifiedBy: "admin",
		uses: 0,
	},
	{
		couponId: 2,
		couponCode: "WELCOME25",
		createdBy: "admin",
		createdAt: Date.now() - 100,
		lastModified: Date.now() - 100,
		lastModifiedBy: "admin",
		uses: 0,
	},
	{
		couponId: 3,
		couponCode: "WELCOME26",
		createdBy: "admin",
		createdAt: Date.now() - 6000,
		lastModified: Date.now() - 6000,
		lastModifiedBy: "admin",
		uses: 0
	},
	{
		couponId: 4,
		couponCode: "WELCOME27",
		createdBy: "admin",
		createdAt: Date.now() - 1000000000,
		lastModified: Date.now() - 1000000000,
		lastModifiedBy: "admin",
		uses: 0
	},
	{
		couponId: 5,
		couponCode: "WELCOME28",
		createdBy: "admin",
		createdAt: Date.now() - 10000000000,
		lastModified: Date.now() - 10000000000,
		lastModifiedBy: "admin",
		uses: 0
	},
];

class ReportMock implements MockRule {
	register(mock: MockAdapter) {
		mock.onGet("/reports").reply(() => {
			return [
				200,
				{
					reports
				}
			];
		});

		mock.onPost("/report").reply((config) => {
			const data = JSON.parse(config.data);

			const report = reports.find((report) => report.couponId === data.couponId);
			if (report) {
				return [
					400,
					{
						message: "Report already exists"
					}
				];
			}
			reports.push(data);
			return [200, {}];
		});

		mock.onPut("/report").reply((config) => {
			const data = JSON.parse(config.data);

			const reportIndex = reports.findIndex((report) => report.couponId === data.couponId);

			if (reportIndex === -1) {
				return [
					404,
					{
						message: "Report not found"
					}
				];
			}

			reports[reportIndex] = { ...reports[reportIndex], ...data };
			return [200, {}];
		});

		mock.onPatch("/report").reply((config) => {
			const data = JSON.parse(config.data);

			reports.forEach((report, index) => {
				if (data.codes.includes(report.couponCode)) {
					reports[index].uses = (report.uses + 1);
				}
			});
			return [200, {}];
		});
	};
}

export const reportMock = new ReportMock();