import ExcelJS from "exceljs";
import { Button } from "@nextui-org/react";
import { saveAs } from "file-saver";
import Context, { CouponData } from "../context/Context";
import { Dispatch, SetStateAction, useContext } from "react";
import { couponController } from "../controllers/coupon";
import { toast } from "react-toastify";

type Props = {
	setLoading: Dispatch<SetStateAction<boolean>>;
}

const formatCouponData = (coupons: CouponData[]) => {
	return coupons.map((coupon) => ({
		ID: coupon.id || "",
		"Created By": coupon.createdBy || "",
		"Created At": coupon.createdAt
			? new Date(coupon.createdAt).toLocaleDateString("en-GB")
			: "",
		"Last Modified": coupon.lastModified
			? new Date(coupon.lastModified).toLocaleDateString("en-GB")
			: "",
		"Last Modified By": coupon.lastModifiedBy || "",
		Code: coupon.code,
		Description: coupon.description,
		Discount: `${coupon.discountAmount}${coupon.discountType === "percent" ? "%" : "₪"}`,
		"Expiration Date": coupon.expirationDate
			? new Date(coupon.expirationDate).toLocaleDateString("en-GB")
			: "N/A",
		"Can Combine": coupon.canCombine ? "Yes" : "No",
		"Limit Uses": coupon.limitUses === "0" ? "Unlimited" : coupon.limitUses,
	}));
};

export const CouponExportToExcel: React.FC<Props> = ({ setLoading }) => {
	const { setCoupons } = useContext(Context);

	const handleExport = async () => {
		setLoading(true);

		const res = await couponController.load();

		const { coupons } = res;

		if (!coupons.length) {
			toast.error("Failed: Coupons failed to export");
			return;
		}

		setCoupons(coupons);

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Coupons");

		const formattedData = formatCouponData(coupons);

		worksheet.columns = Object.keys(formattedData[0]).map((key) => ({
			header: key,
			key,
			width: 20,
		}));

		formattedData.forEach((dataRow) => worksheet.addRow(dataRow));

		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], { type: "application/octet-stream" });
		saveAs(blob, "Coupons.xlsx");

		setLoading(false);
		toast.success("Loaded Coupons and exported to Excel");
	};

	return <Button onClick={handleExport}>Export Coupons to Excel</Button>
};
