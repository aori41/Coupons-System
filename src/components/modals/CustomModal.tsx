import { ReactNode, useContext } from "react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { Save } from "lucide-react";
import Context from "../../context/Context";

type ModalProps = {
	title: string;
	children: ReactNode;
	button: ReactNode | string;
	acceptButtonType: "save" | "accept"
	onSave?: () => Promise<boolean>;
	resetParams?: () => void;
}

export const CustomModal: React.FC<ModalProps> = ({ title, button, acceptButtonType, onSave, resetParams, children }) => {
	const { theme } = useContext(Context);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return <>
		<Button onPress={onOpen} isIconOnly={(typeof button) !== "string"}>{button}</Button>
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={resetParams} isDismissable={false} isKeyboardDismissDisabled={true} className={`${theme === "dark" && "bg-[#111827] text-white"} min-w-max`}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col">{title}</ModalHeader>
						<ModalBody className="min-h-max min-w-max">
							{children}
						</ModalBody>
						<ModalFooter>
							<div className="w-full flex justify-between">
								<Button color="danger" variant="light" onClick={() => {
									onClose();
									resetParams && resetParams();
								}}>
									Close
								</Button>
								{onSave && <Button
									onClick={async () => {
										const save = await onSave();

										if (save) {
											onClose();
											resetParams && resetParams();
										}
									}}
									className={`text-white font-bold ${theme === "dark" ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400"}`}
								>
									{acceptButtonType === "save" ? <>
										<Save />
										Save
									</> : <>
										Accept
									</>}
								</Button>}
							</div>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal >
	</>
};