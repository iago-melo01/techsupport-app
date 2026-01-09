import type { InputHTMLAttributes, LabelHTMLAttributes } from "react";

export type LabelInputProps =
	LabelHTMLAttributes<HTMLLabelElement> & {
		value: string;
		className?: string;
	};

export type ErrorInputProps = {
	message?: string;
	className?: string;
};

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	isFocused?: boolean;
};
