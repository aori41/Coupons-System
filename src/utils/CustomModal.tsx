import { ReactNode, useContext } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import Context from "../context/Context";

type ButtonConfig = {
	label: string;
	onClick?: () => void;
	closeModal?: boolean;
	className?: string;
};

type ModalProps = {
	title: string;
	children: ReactNode;
	buttonText: string;
	buttons?: ButtonConfig[];
}

export const CustomModal: React.FC<ModalProps> = ({ title, buttons, buttonText, children }) => {
	const { theme } = useContext(Context);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return <>
		<Button onPress={onOpen}>{buttonText}</Button>
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} className={`${theme === "dark" && "bg-[#111827] text-white"} min-w-max`}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col">{title}</ModalHeader>
						<ModalBody>
							{children}
						</ModalBody>
						<ModalFooter>
							<div className="w-full flex justify-between">
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<div className="flex gap-x-2">
									{buttons && buttons.map((button, index) => (
										<Button
											key={index}
											onClick={() => {
												button.onClick?.();
												if (button.closeModal) onClose();
											}}
											className={button.className || "bg-gray-500 hover:bg-gray-700"}
										>
											{button.label}
										</Button>
									))}
								</div>
							</div>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	</>
};
