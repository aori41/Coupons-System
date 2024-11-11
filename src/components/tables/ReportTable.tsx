import { useState, useContext, useEffect, SetStateAction, Dispatch } from "react";
import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Select, SelectItem, Input } from "@nextui-org/react";
import { ReportData } from "../../context/Context";
import { ReportExportToExcel } from "../ReportExportToExcel";
import { UserModal } from "../modals/UserModal";
import Context from "../../context/Context";

const columns = [
	{ name: "Coupon ID", uid: "couponId" },
	{ name: "Code", uid: "couponCode" },
	{ name: "Created By", uid: "createdBy" },
	{ name: "Created At", uid: "createdAt" },
	{ name: "Last Modified", uid: "lastModified" },
	{ name: "Modified By", uid: "lastModifiedBy" },
	{ name: "Deleted By", uid: "deletedBy" },
	{ name: "Uses", uid: "uses" },
];

export const ReportTable: React.FC<{ setLoading: Dispatch<SetStateAction<boolean>> }> = ({ setLoading }) => {
	const { reports, users } = useContext(Context);
	const [admins, setAdmins] = useState<string[]>(["All", ...users]);
	const [filteredReports, setFilteredReports] = useState<ReportData[]>(reports);
	const [selectedUser, setSelectedUser] = useState<string>("All");
	const [startDate, setStartDate] = useState<string | undefined>(undefined);
	const [endDate, setEndDate] = useState<string | undefined>(undefined);

	useEffect(() => {
		const start = startDate ? new Date(startDate) : undefined;
		const end = endDate ? new Date(endDate) : undefined;

		const result = reports.filter((report) => {
			const byUser = selectedUser === "All" || report.createdBy === selectedUser;
			if (!byUser) return false;

			const reportDate = new Date(report.createdAt);

			if (start && end) {
				return reportDate >= start && reportDate <= end;
			} else if (start) {
				return reportDate >= start;
			} else if (end) {
				return reportDate <= end;
			}
			return true;
		});

		setFilteredReports(result);
	}, [startDate, endDate, selectedUser]);

	useEffect(() => {
		setAdmins(["All", ...users]);
	}, [users]);

	const renderCell = (report: ReportData, columnKey: string | number) => {
		const cellValue = report[columnKey as keyof ReportData];

		switch (columnKey) {
			case "createdAt":
			case "lastModified":
				return new Date(cellValue as number).toLocaleDateString("en-GB");
			case "deletedBy":
				return cellValue ? <Chip color="danger" size="sm">{cellValue}</Chip> : <Chip size="sm">Active</Chip>;
			case "uses":
				return <span className="text-lg">{cellValue}</span>;
			default:
				return cellValue;
		}
	};

	return <>
		<div className="flex justify-between gap-4">
			<div className="flex min-w-[50%] gap-4">
				<Select label="Filter by User" placeholder="All" className="max-w-xs" onChange={(e) => setSelectedUser(e.target.value)}>
					{admins.map((user) => (
						<SelectItem key={user} value={user}>
							{user}
						</SelectItem>
					))}
				</Select>
				<Input
					label="Start Date"
					type="date"
					value={startDate || ""}
					onChange={(e) => setStartDate(e.target.value)}
					className="max-w-xs"
				/>
				<Input
					label="End Date"
					type="date"
					value={endDate || ""}
					onChange={(e) => setEndDate(e.target.value)}
					className="max-w-xs"
				/>
			</div>
			<div className="flex gap-x-2 justify-end items-end">
				<ReportExportToExcel setLoading={setLoading} />
				<UserModal button="Add Admin" setLoading={setLoading} title="Create New Admin" />
			</div>
		</div>
		<Table aria-label="Report List" className="h-full" isHeaderSticky>
			<TableHeader columns={columns}>
				{(column) => (
					<TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
						{column.name}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody items={filteredReports}>
				{(item) => (
					<TableRow key={item.couponId}>
						{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
					</TableRow>
				)}
			</TableBody>
		</Table>
	</>
};
