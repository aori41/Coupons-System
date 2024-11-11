import ExcelJS from "exceljs";
import { Button } from "@nextui-org/react";
import { saveAs } from "file-saver";
import Context, { ReportData } from "../context/Context";
import { Dispatch, SetStateAction, useContext } from "react";
import { toast } from "react-toastify";
import { reportController } from "../controllers/report";

type Props = {
	setLoading: Dispatch<SetStateAction<boolean>>;
};

const formatReportData = (reports: ReportData[]) => {
	return reports.map((report) => ({
		"Created By": report.createdBy || "",
		"Created At": report.createdAt
			? new Date(report.createdAt).toLocaleDateString("en-GB")
			: "",
		"Last Modified": report.lastModified
			? new Date(report.lastModified).toLocaleDateString("en-GB")
			: "",
		"Last Modified By": report.lastModifiedBy || "",
		"Deleted By": report.deletedBy || "",
		Code: report.couponCode,
		Uses: report.uses || 0,
	}));
};

export const ReportExportToExcel: React.FC<Props> = ({ setLoading }) => {
	const { setReports } = useContext(Context);

	const handleExport = async () => {
		setLoading(true);

		const res = await reportController.load();

		const { reports } = res;

		setReports(reports);

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Reports");

		const formattedData = formatReportData(reports);

		if (!formattedData[0]) {
			toast.error("Failed: Reports failed to export");
			return;
		}

		worksheet.columns = Object.keys(formattedData[0]).map((key) => ({
			header: key,
			key,
			width: 20,
		}));

		formattedData.forEach((dataRow) => worksheet.addRow(dataRow));

		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], { type: "application/octet-stream" });
		saveAs(blob, "Reports.xlsx");

		setLoading(false);
		toast.success("Loaded Reports and exported to Excel");
	};

	return <Button onClick={handleExport}>Export Reports to Excel</Button>;
};