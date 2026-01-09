import { Eye, EyeOff } from "lucide-react";
import type { ToggleVisibilityButtonProps } from "../../Types/Ui/Buttons/ButtonsProps";

export default function ToggleVisibilityButton({
	isVisible,
	onToggle,
	className = "cursor-pointer",
	...props
}: ToggleVisibilityButtonProps) {
	return (
		<button
			type="button"
			onClick={onToggle}
			className={className}
			{...props}
		>
			{isVisible ? (
				<Eye className="w-5 h-7 text-[#2E3E4D] pt-[8px]" />
			) : (
				<EyeOff className="w-5 h-7 text-[#2E3E4D] pt-[8px]" />
			)}
		</button>
	);
}
