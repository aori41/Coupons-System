import { useLocation } from "wouter";

const useCustomNavigate = () => {
	const [, setLocation] = useLocation();

	const navigate = (url: string) => {
		setLocation(url);
	};
	return navigate;
};

export default useCustomNavigate;