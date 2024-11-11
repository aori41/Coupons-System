import { Dispatch, ReactNode, SetStateAction } from "react"

export type Modal = {
	title: string;
	button: ReactNode | string;
	isEdit?: boolean;
	setLoading: Dispatch<SetStateAction<boolean>>
}