import type { ErrorInputProps } from "../../Types/Ui/Inputs/InputProps";

export default function ErrorInput({
	message,
	className = "",
	...rest
}: ErrorInputProps) {
	return message ? (
		<p
			{...rest}
			className={"text-sm text-red-600 lg:text-lg " + className}
		>
			{message}
		</p>
	) : null;
}
