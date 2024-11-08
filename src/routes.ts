
import { FunctionComponent } from "react";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Panel } from "./pages/Panel";
import { Reports } from "./pages/Reports";

type MenuItem = {
	label: string;
	link: string;
	component: FunctionComponent;
	showInNavbar: boolean;
	loginNeeded?: boolean;
}

export const menuItems: MenuItem[] = [
	{
		label: "Home",
		link: "/",
		component: Home,
		showInNavbar: true
	},
	{
		label: "Login",
		link: "/login",
		component: Login,
		showInNavbar: false,
	},
	{
		label: "Manage",
		link: "/panel",
		component: Panel,
		showInNavbar: true,
		loginNeeded: true
	},
	{
		label: "Reports",
		link: "/reports",
		component: Reports,
		showInNavbar: true,
		loginNeeded: true
	},
] as const;
