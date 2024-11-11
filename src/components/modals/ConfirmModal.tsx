import { Modal } from "./types";
import { CustomModal } from "./CustomModal";

export const ConfirmModal: React.FC<Partial<Modal> & { onAccept: () => Promise<boolean> }> = ({ button, title, onAccept }) => {
	return <>
		<CustomModal
			button={button}
			title={title as string}
			onSave={onAccept}
			acceptButtonType="accept"
		>
			<div className="w-full flex flex-col space-y-4">
				<p
					role="alert"
					aria-live="assertive"
					className="text-red-600 font-semibold"
				>
					This action is irreversible and cannot be undone.
				</p>
			</div>
		</CustomModal>
	</>
}