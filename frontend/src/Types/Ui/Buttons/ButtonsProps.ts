import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonsProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
	children: ReactNode;
}

export type ToggleVisibilityButtonProps = {
	isVisible: boolean;
	onToggle: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;
