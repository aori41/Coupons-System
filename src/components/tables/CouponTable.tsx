import { Dispatch, SetStateAction, useContext } from "react";
import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { Edit, Trash2 } from "lucide-react";
import { CouponModal } from "../modals/CouponModal";
import { toast } from "react-toastify";
import Context, { CouponData } from "../../context/Context";
import { couponController } from "../../controllers/coupon";
import { reportController } from "../../controllers/report";
import { ConfirmModal } from "../modals/ConfirmModal";

const columns = [
	{ name: "Code", uid: "code" },
	{ name: "Description", uid: "description" },
	{ name: "Discount", uid: "discountAmount" },
	{ name: "Expiration Date", uid: "expirationDate" },
	{ name: "Combine", uid: "canCombine" },
	{ name: "Limit", uid: "limitUses" },
	{ name: "Actions", uid: "actions" },
];

export const CouponTable: React.FC<{ setLoading: Dispatch<SetStateAction<boolean>> }> = ({ setLoading }) => {
	const { coupons, setCoupons, username, reports, setReports } = useContext(Context);

	const handleDeleteCoupon = async (couponData: CouponData) => {
		if (!couponData.id) {
			toast.error("Failed: Invalid Coupon");
			return false;
		}

		setLoading(true);

		const couponRes = await couponController.delete(couponData.id);

		if (couponRes?.message) {
			toast.error("Failed: " + couponRes.message);
			setLoading(false);
			return false;
		}

		await reportController.edit({ deletedBy: username, couponId: couponData.id });

		setLoading(false);

		const couponIndex = coupons.findIndex((coupon) => coupon.id === couponData.id);

		if (couponIndex === -1) {
			toast.error("Failed: Coupon not found");
			return false;
		}

		toast.success("Deleted Coupon Successfully");
		const newCoupons = coupons.filter((_, index) => index !== couponIndex);
		setCoupons(newCoupons);

		const newReports = reports.map(report => report.couponId === couponData.id ? { ...report, deletedBy: username } : report);
		setReports(newReports);
		return true;
	}

	const renderCell = (coupon: CouponData, columnKey: string | number) => {
		if (columnKey === "actions") {
			return (
				<div className="relative flex items-center gap-2">
					<Tooltip content="Edit coupon">
						<span className="text-lg text-blue-500 cursor-pointer active:opacity-50">
							<CouponModal
								title="Edit Coupon"
								isEdit={true}
								button={
									<span className="text-lg text-blue-500 cursor-pointer active:opacity-50">
										<Edit size={20} />
									</span>
								}
								{...coupon}
								setLoading={setLoading}
							/>
						</span>
					</Tooltip>
					<Tooltip color="danger" content="Delete coupon">
						<div className="cursor-pointer active:opacity-50">
							<ConfirmModal
								button={
									<span className="text-lg text-red-500 cursor-pointer active:opacity-50">
										<Trash2 size={20} />
									</span>
								}
								onAccept={() => handleDeleteCoupon(coupon)}
								title="Are You sure?" />
						</div>
					</Tooltip>
				</div>
			);
		}

		const cellValue = coupon[columnKey as keyof CouponData];

		switch (columnKey) {
			case "discountAmount":
				return coupon.discountType === "percent"
					? `${coupon.discountAmount}%`
					: `${coupon.discountAmount}₪`;
			case "expirationDate":
				const dateValue = coupon[columnKey as keyof CouponData];

				if (typeof dateValue === "number") {
					return (dateValue ? new Date(dateValue).toLocaleDateString("en-GB") : "Not Available");
				}
				return "Not Available";
			case "canCombine":
				return <>
					<Chip color={coupon[columnKey as keyof CouponData] ? "success" : "default"} size="sm" variant="flat">
						{coupon[columnKey as keyof CouponData] ? "Yes" : "No"}
					</Chip>
				</>
			case "limitUses":
				return <span className="text-lg">{!coupon.limitUses || coupon.limitUses <= 0 ? "Unlimited" : coupon.limitUses}</span>
			case "description":
				return <div className="max-w-xs truncate">{coupon.description}</div>
			default:
				return cellValue;
		}
	};

	const sortedCoupons = coupons.sort((a, b) => (a.id && b.id ? b.id - a.id : 0));

	return <>
		<Table aria-label="Coupon List" className="h-full" isHeaderSticky>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody items={sortedCoupons} className="overflow-y-scroll">
				{(item) => (
					<TableRow key={item.id}>
						{(columnKey) => <TableCell style={{ maxWidth: "16px" }}>{renderCell(item, columnKey)}</TableCell>}
					</TableRow>
				)}
			</TableBody>
		</Table>
	</>
}