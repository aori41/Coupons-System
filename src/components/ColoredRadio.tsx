import { useContext } from "react";
import { Radio } from "@nextui-org/react";
import Context from "../context/Context";

type ColoredRadioProps = {
	value: string;
	label: string;
	className?: string;
}

export const ColoredRadio: React.FC<ColoredRadioProps> = ({ value, label, className }) => {
	const { theme } = useContext(Context);
	return <Radio value={value} classNames={{ label: theme === "dark" && "text-white" }} className={className}>{label}</Radio>
}
