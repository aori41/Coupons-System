import { useContext, useState } from "react";
import { Gift, Moon, Sun, UserRound } from "lucide-react";
import { routesHandler } from "../routes";
import Context from "../context/Context";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
	Link,
	Button,
	Switch,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem
} from "@nextui-org/react";

const clearAuthCookies = () => {
	const cookiesToClear = ["authToken", "sessionId"];

	cookiesToClear.forEach((cookieName) => {
		document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	});
};

export const NavBar: React.FC = () => {
	const { theme, setTheme, logged, setLogged } = useContext(Context);
	const [openMenu, setOpenMenu] = useState(false);

	const changeTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	}

	const handleLogout = () => {
		setLogged(false);
		clearAuthCookies();
		window.location.href = "/";
	}

	return <>
		<Navbar maxWidth="full" position="sticky" className="dark:bg-gray-600 w-full" onMenuOpenChange={setOpenMenu}>
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
					<NavbarMenuItem key={index} isActive={route.link === window.location.pathname}>
						<Link color="foreground" href={route.link}>{route.label}</Link>
					</NavbarMenuItem>
				))}
			</NavbarContent>
			<NavbarMenu>
				{routesHandler.filter(route => route.showInNavbar && !(route.loginNeeded && !logged)).map((route, index) => (
					<NavbarMenuItem key={`${route}-${index}`}>
						<Link
							className={`w-full ${theme === "dark" ? "text-white" : "text-black"}`}
							href={route.link}
							size="lg"
						>
							{route.label}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
			<NavbarContent justify="end">
				<NavbarItem className="flex items-center justify-center gap-x-2">
					{logged ?
						<Dropdown>
							<DropdownTrigger>
								<Button
									variant="flat"
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
					<Switch
						size="sm"
						color="default"
						thumbIcon={() =>
							theme === "dark" ? <Sun strokeWidth={1.5} color="#000" size={14} /> : <Moon strokeWidth={1.5} size={14} />
						}
						isSelected={theme === "dark"}
						onValueChange={changeTheme}
					/>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	</>
}