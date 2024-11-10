import { createContext, useState, ReactNode, useEffect } from "react";

export type CouponData = {
	code: string;
	description: string;
	discountType: "percent" | "ils";
	discountAmount: number;
	expirationDate?: number;
	canCombine: boolean;
	limitUses: string;
}

type ContextType = {
	logged: boolean;
	setLogged: React.Dispatch<React.SetStateAction<boolean>>;
	theme: "light" | "dark";
	setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
	coupons: CouponData[];
	setCoupons: React.Dispatch<React.SetStateAction<CouponData[]>>;
}

const defaultValues = {
	logged: false,
	setLogged: () => { },
	theme: localStorage.getItem("theme") as "light" | "dark" || "light",
	setTheme: () => { },
	coupons: [],
	setCoupons: () => { },
}

const Context = createContext<ContextType>(defaultValues);

type Props = {
	children: ReactNode;
}

export const ContextProvider: React.FC<Props> = ({ children }) => {
	const [logged, setLogged] = useState<boolean>(defaultValues.logged);
	const [theme, setTheme] = useState<"light" | "dark">(defaultValues.theme);
	const [coupons, setCoupons] = useState<CouponData[]>([]);

	useEffect(() => {
		localStorage.setItem("theme", theme);
	}, [theme]);

	return <>
		<Context.Provider value={{ logged, setLogged, theme, setTheme, coupons, setCoupons }}>
			{children}
		</Context.Provider>
	</>
};

export default Context;
