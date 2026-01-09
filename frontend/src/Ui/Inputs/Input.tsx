import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	type ForwardedRef,
} from "react";
import type { InputProps } from "../../Types/Ui/Inputs/InputProps";
import { baseFormControl } from "../../Utils/Ui/Form/BaseFormUi";

const Input = forwardRef(function InputText(
	{
		type = "text",
		className = "",
		isFocused = false,
		placeholder = "",
		value,
		onChange,
		...props
	}: InputProps,
	ref: ForwardedRef<{ focus: () => void }>
) {
	const localRef = useRef<HTMLInputElement>(null);

	useImperativeHandle(ref, () => ({
		focus: () => localRef.current?.focus(),
	}));

	useEffect(() => {
		if (isFocused) {
			localRef.current?.focus();
		}
	}, [isFocused]);

	return (
		<input
			{...props}
			value={value ?? ""}
			onChange={onChange}
			type={type}
			className={`${baseFormControl} w-full ${className}`}
			placeholder={placeholder}
			ref={localRef}
		/>
	);
});

export default Input;
