import type { LabelInputProps } from "../../Types/Ui/Inputs/InputProps";

export default function LabelInput({
	value,
	className = "",
	...props
}: LabelInputProps) {
	return (
		<label
			{...props}
			className={`block text-sm font-medium text-gray-600 lg:text-lg ${className}`}
		>
			{value}
		</label>
	);
}
