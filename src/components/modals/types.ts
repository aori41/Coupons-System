import { Dispatch, SetStateAction } from "react"

export type Modal = {
	setLoading: Dispatch<SetStateAction<boolean>>
}