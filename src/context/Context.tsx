import { createContext, useState, ReactNode, useEffect } from "react";

type AppliedCoupon = {
	code: string;
	discountAmount: number;
	discountType: "percent" | "ils"
}

export type CouponData = {
	id?: number;
	description: string;
	expirationDate?: number;
	canCombine: boolean;
	limitUses?: number;
	uses?: number;
} & AppliedCoupon

export type ReportData = {
	couponId: number;
	couponCode: string;
	createdBy: string;
	createdAt: number;
	lastModified: number;
	lastModifiedBy: string;
	deletedBy?: string;
	uses: number;
}

type ContextType = {
	logged: boolean;
	setLogged: React.Dispatch<React.SetStateAction<boolean>>;
	username: string;
	setUsername: React.Dispatch<React.SetStateAction<string>>;
	theme: "light" | "dark";
	setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
	coupons: CouponData[];
	setCoupons: React.Dispatch<React.SetStateAction<CouponData[]>>;
	reports: ReportData[];
	setReports: React.Dispatch<React.SetStateAction<ReportData[]>>;
	users: string[];
	setUsers: React.Dispatch<React.SetStateAction<string[]>>;
	appliedCoupons: AppliedCoupon[];
	setAppliedCoupons: React.Dispatch<React.SetStateAction<AppliedCoupon[]>>;
}

const defaultValues = {
	logged: false,
	setLogged: () => { },
	username: "",
	setUsername: () => { },
	theme: localStorage.getItem("theme") as "light" | "dark" || "light",
	setTheme: () => { },
	coupons: [],
	setCoupons: () => { },
	reports: [],
	setReports: () => { },
	users: [],
	setUsers: () => { },
	appliedCoupons: [],
	setAppliedCoupons: () => { },
}

const Context = createContext<ContextType>(defaultValues);

type Props = {
	children: ReactNode;
}

export const ContextProvider: React.FC<Props> = ({ children }) => {
	const [logged, setLogged] = useState<boolean>(defaultValues.logged);
	const [username, setUsername] = useState<string>(defaultValues.username);
	const [theme, setTheme] = useState<"light" | "dark">(defaultValues.theme);
	const [coupons, setCoupons] = useState<CouponData[]>(defaultValues.coupons);
	const [reports, setReports] = useState<ReportData[]>(defaultValues.reports);
	const [users, setUsers] = useState<string[]>(defaultValues.users);
	const [appliedCoupons, setAppliedCoupons] = useState<AppliedCoupon[]>(defaultValues.appliedCoupons);

	useEffect(() => {
		localStorage.setItem("theme", theme);
	}, [theme]);

	return <>
		<Context.Provider value={{
			logged,
			setLogged,
			username,
			setUsername,
			theme,
			setTheme,
			coupons,
			setCoupons,
			reports,
			setReports,
			users,
			setUsers,
			appliedCoupons,
			setAppliedCoupons
		}}>
			{children}
		</Context.Provider>
	</>
};

export default Context;
