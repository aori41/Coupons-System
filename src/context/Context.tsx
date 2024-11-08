import { createContext, useState, ReactNode, useEffect } from "react";

type ContextType = {
	logged: boolean;
	setLogged: React.Dispatch<React.SetStateAction<boolean>>;
	theme: "light" | "dark";
	setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

const defaultValues = {
	logged: false,
	setLogged: () => { },
	theme: localStorage.getItem("theme") as "light" | "dark" || "light",
	setTheme: () => { },
}

const Context = createContext<ContextType>(defaultValues);

type Props = {
	children: ReactNode;
}

export const ContextProvider: React.FC<Props> = ({ children }) => {
	const [logged, setLogged] = useState<boolean>(defaultValues.logged);
	const [theme, setTheme] = useState<"light" | "dark">(defaultValues.theme);

	useEffect(() => {
		localStorage.setItem("theme", theme);
	}, [theme]);

	return <>
		<Context.Provider value={{ logged, setLogged, theme, setTheme }}>
			{children}
		</Context.Provider>
	</>
};

export default Context;
