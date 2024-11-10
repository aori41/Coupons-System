import { ReactNode, useContext } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { Save } from "lucide-react";
import Context from "../context/Context";

type ModalProps = {
	title: string;
	children: ReactNode;
	buttonText: string;
	onSave?: () => boolean;
	onCancel?: () => void;
}

export const CustomModal: React.FC<ModalProps> = ({ title, buttonText, onSave, onCancel, children }) => {
	const { theme } = useContext(Context);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return <>
		<Button onPress={onOpen}>{buttonText}</Button>
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onCancel} isDismissable={false} isKeyboardDismissDisabled={true} className={`${theme === "dark" && "bg-[#111827] text-white"} min-w-max`}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col">{title}</ModalHeader>
						<ModalBody>
							{children}
						</ModalBody>
						<ModalFooter>
							<div className="w-full flex justify-between">
								<Button color="danger" variant="light" onClick={() => {
									onClose();
									onCancel && onCancel();
								}}>
									Close
								</Button>
								{onSave && <Button
									onClick={() => {
										const save = onSave();
										if (save) {
											onClose();
											onCancel && onCancel();
										}
									}}
									className={`text-white font-bold ${theme === "dark" ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400"}`}
								>
									<Save />
									Save
								</Button>}
							</div>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	</>
};
