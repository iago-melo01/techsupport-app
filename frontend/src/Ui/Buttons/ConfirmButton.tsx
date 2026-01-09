import type { ButtonsProps } from "../../Types/Ui/Buttons/ButtonsProps";

export default function ConfirmButton({
	className = "",
	children,
	disabled,
	...rest
}: ButtonsProps) {
	return (
		<button
			{...rest}
			className={`
                px-6 py-2 cursor-pointer bg-[#3E5063] hover:bg-[#768b9a] text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-400 lg:text-sm
                 ${className} ${
				disabled ? "opacity-25 cursor-not-allowed" : ""
			}`}
			disabled={disabled}
		>
			{children}
		</button>
	);
}
