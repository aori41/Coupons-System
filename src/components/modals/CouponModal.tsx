import { useContext, useState } from "react";
import { Modal } from "./types";
import { toast } from "react-toastify";
import { CustomModal } from "./CustomModal";
import { Button, Input, RadioGroup, Textarea } from "@nextui-org/react";
import { RefreshCcw } from "lucide-react";
import { ColoredRadio } from "../ColoredRadio";
import { couponController } from "../../controllers/coupon";
import Context, { CouponData } from "../../context/Context";
import { reportController } from "../../controllers/report";

const formatDateForInput = (timestamp: number) => {
	const date = new Date(timestamp);

	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");
	const hours = `${date.getHours()}`.padStart(2, "0");
	const minutes = `${date.getMinutes()}`.padStart(2, "0");

	return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const CouponModal: React.FC<CouponData & Modal> = ({ button, title, isEdit, id, code, canCombine, discountType, discountAmount, description, limitUses, expirationDate, setLoading }) => {
	const { coupons, setCoupons, reports, setReports, username } = useContext(Context);

	const [isLimit, setIsLimit] = useState<boolean>(!!(limitUses && limitUses > 0));
	const [couponData, setCouponData] = useState<CouponData>({
		id,
		code,
		description,
		discountType,
		discountAmount,
		expirationDate,
		canCombine,
		limitUses,
	});

	const resetValues = () => {
		setCouponData({
			id,
			code,
			description,
			discountType,
			discountAmount,
			expirationDate,
			canCombine,
			limitUses,
		})
	}

	const handleSaveCoupon = async () => {
		if (!couponData.code || !couponData.discountAmount) {
			toast.error("Failed: Code and Discount amount are required");
			return false;
		}
		setLoading(true);

		const id = Date.now();
		const reportData = { lastModified: Date.now(), lastModifiedBy: username, couponId: couponData.id || id };

		let couponRes;

		if (isEdit) {
			couponRes = await couponController.edit({ ...couponData });
			await reportController.edit({ ...reportData });
		} else {
			couponRes = await couponController.create({ ...couponData, id });
			await reportController.create({ ...reportData, createdBy: username, couponId: id, couponCode: couponData.code, createdAt: Date.now(), uses: 0 });
		}

		setLoading(false);

		if (couponRes?.message) {
			toast.error("Failed: " + couponRes.message);
			return false;
		}

		if (isEdit) {
			const updatedCoupons = coupons.map((coupon) => coupon.id === couponData.id ? { ...coupon, ...couponData } : coupon);
			setCoupons(updatedCoupons);

			const updatedReports = reports.map((report) => report.couponId === couponData.id ? { ...report, ...reportData } : report);
			setReports(updatedReports);
		} else {
			setCoupons([...coupons, { ...couponData, id }]);
			setReports([...reports, { ...reportData, createdBy: username, couponId: id, couponCode: couponData.code, createdAt: Date.now(), uses: 0 }]);
		}
		toast.success("Saved the coupon successfully");
		return true;
	}

	const generateCouponCode = () => {
		const code = Math.random().toString(36).substring(2, 8).toUpperCase();
		setCouponData({ ...couponData, code });
	};

	return <>
		<CustomModal
			button={button}
			title={title}
			onSave={handleSaveCoupon}
			resetParams={resetValues}
			acceptButtonType="save"
		>
			<div className="p-4 w-full flex flex-wrap space-y-4">
				<div className="w-full md:w-1/2 space-y-4 pr-2 flex flex-col justify-center">
					<section className="flex flex-col gap-y-8 mt-4">
						<label htmlFor="coupon-code" className='text-gray-500'>Coupon Code</label>
						<div className="w-full flex gap-x-3 items-center">
							<Input
								id="coupon-code"
								name="code"
								isClearable
								label="Coupon Code"
								fullWidth
								classNames={{ clearButton: "text-black" }}
								value={couponData.code}
								onChange={(e) => setCouponData({ ...couponData, code: e.target.value })}
								onClear={() => setCouponData({ ...couponData, code: "" })}
								aria-describedby="generate-code-desc"
							/>
							<Button
								isIconOnly
								onClick={generateCouponCode}
								aria-label="Generate coupon code"
								id="generate-code-desc"
							>
								<RefreshCcw />
							</Button>
						</div>
					</section>
					<fieldset>
						<legend className="sr-only">Discount Type</legend>
						<RadioGroup
							label="Discount Type"
							value={couponData.discountType}
							orientation="horizontal"
							onChange={(e) => setCouponData({ ...couponData, discountType: e.target.value as "percent" | "ils" })}
						>
							<ColoredRadio value="percent" label="Percent" />
							<ColoredRadio value="ils" label="ILS" />
						</RadioGroup>
					</fieldset>

					<label htmlFor="discount-amount" className="sr-only">Discount Amount</label>
					<Input
						id="discount-amount"
						type="number"
						label="Discount Amount"
						fullWidth
						min={1}
						value={`${couponData.discountAmount}`}
						onChange={(e) => setCouponData({ ...couponData, discountAmount: +e.target.value })}
						aria-labelledby="discount-type-amount"
					/>
				</div>
				<div className="w-full md:w-1/2 space-y-4 pl-2 flex flex-col justify-center">
					<fieldset>
						<legend className="sr-only">Expiration Date</legend>
						<RadioGroup
							label="Expiration Date"
							value={couponData.expirationDate === undefined ? "never" : "set"}
							orientation="horizontal"
							onChange={(e) => {
								setCouponData({
									...couponData,
									expirationDate: (e.target.value === "never" ? undefined : Date.now()),
								});
							}}
						>
							<ColoredRadio value="never" label="Never Expire" />
							<ColoredRadio value="set" label="Set Expiration" />
						</RadioGroup>
					</fieldset>
					<label htmlFor="expiration-date" className="sr-only">Expiration Date</label>
					<Input
						id="expiration-date"
						type="datetime-local"
						value={formatDateForInput(couponData.expirationDate || Date.now())}
						isDisabled={!couponData.expirationDate}
						onChange={(e) => setCouponData({ ...couponData, expirationDate: new Date(e.target.value).getTime() })}
						aria-describedby="expiration-date-desc"
					/>
					<fieldset>
						<legend className="sr-only">Usage Limit</legend>
						<RadioGroup
							label="Usage Limit"
							value={!isLimit ? "unlimited" : "limited"}
							orientation="horizontal"
							onChange={(e) => {
								setIsLimit(!isLimit);
								setCouponData({ ...couponData, limitUses: e.target.value === "unlimited" ? undefined : 1 });
							}}
						>
							<ColoredRadio value="unlimited" label="No Limit" />
							<ColoredRadio value="limited" label="Set Limit" />
						</RadioGroup>
					</fieldset>
					<label htmlFor="limit-uses" className="sr-only">Limit Uses</label>
					<Input
						id="limit-uses"
						type="number"
						label="Limit Uses"
						fullWidth
						isDisabled={!isLimit}
						min={1}
						value={`${couponData.limitUses || ""}`}
						onChange={(e) => setCouponData({ ...couponData, limitUses: +e.target.value })}
					/>
				</div>
				<div className="w-full space-y-4">
					<fieldset>
						<legend className="sr-only">Can Combine with Other Coupons?</legend>
						<RadioGroup
							label="Can Combine with Other Coupons?"
							value={couponData.canCombine ? "yes" : "no"}
							onChange={(e) => setCouponData({ ...couponData, canCombine: e.target.value === "yes" })}
							className="mt-2"
						>
							<ColoredRadio value="no" label="Cannot Combine" />
							<ColoredRadio value="yes" label="Can Combine with Other Coupons" />
						</RadioGroup>
					</fieldset>
					<label htmlFor="description" className="sr-only">Description</label>
					<Textarea
						id="description"
						name="description"
						label="Description"
						fullWidth
						value={couponData.description}
						onChange={(e) => setCouponData({ ...couponData, description: e.target.value })}
					/>
				</div>
			</div>
		</CustomModal>
	</>
}
