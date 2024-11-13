import { useContext, useState } from "react";
import { Gift, Moon, Sun, UserRound } from "lucide-react";
import { Link } from "wouter";
import { routesHandler } from "../routes";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
	Button,
	Switch,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem
} from "@nextui-org/react";
import useCustomNavigate from "../utils/useCustomNavigate";
import Context from "../context/Context";

const clearAuthCookies = () => {
	const cookiesToClear = ["authToken", "sessionId"];

	cookiesToClear.forEach((cookieName) => {
		document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	});
};

export const NavBar: React.FC = () => {
	const { theme, setTheme, logged, setLogged, setUsername, setAppliedCoupons } = useContext(Context);
	const [openMenu, setOpenMenu] = useState<boolean>(false);

	const navigate = useCustomNavigate();

	const changeTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	}

	const handleLogout = () => {
		setLogged(false);
		setUsername("");
		clearAuthCookies();
		setAppliedCoupons([]);
		navigate("/");
	}

	return <>
		<Navbar maxWidth="full" position="sticky" className="w-full bg-black/90 dark:bg-[#111827] text-[#D1D5DB]" onMenuOpenChange={setOpenMenu}>
			<NavbarMenuToggle
				aria-label={openMenu ? "Close menu" : "Open menu"}
				className="sm:hidden"
			/>
			<NavbarBrand className="flex gap-x-1 justify-start">
				<Gift strokeWidth={2.5} />
				<p className="font-bold text-inherit select-none">DealBreaker</p>
			</NavbarBrand>
			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				{routesHandler.filter(route => route.showInNavbar && !(route.loginNeeded && !logged)).map((route, index) => (
					<NavbarMenuItem key={index}>
						<Link color="foreground" className="hover:text-gray-300/70 transition-color duration-100" href={route.link}>{route.label}</Link>
					</NavbarMenuItem>
				))}
			</NavbarContent>
			<NavbarMenu>
				{routesHandler.filter(route => route.showInNavbar && !(route.loginNeeded && !logged)).map((route, index) => (
					<NavbarMenuItem key={`${route.label}-${index}`}>
						<Link
							className={`w-full ${theme === "dark" ? "text-white" : "text-black"}`}
							href={route.link}
						>
							{route.label}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
			<NavbarContent justify="end">
				<NavbarItem className="flex items-center justify-center gap-x-2">
					<Switch
						size="sm"
						color="default"
						thumbIcon={() =>
							theme === "dark" ? <Moon strokeWidth={1.5} color="#000" size={14} /> : <Sun strokeWidth={1.5} color="#000" size={14} />
						}
						isSelected={theme === "dark"}
						onValueChange={changeTheme}
					/>
					{logged ?
						<Dropdown>
							<DropdownTrigger>
								<Button
									variant="solid"
									size="sm"
									className="font-bold"
								>
									<UserRound strokeWidth={2.5} />
									Profile
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label="Action event example"
								onAction={handleLogout}
							>
								<DropdownItem key="logout" className="text-danger" color="danger">
									Logout
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
						:
						<Button as={Link} color="primary" href="/login" variant="flat">
							Login
						</Button>
					}
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	</>
}