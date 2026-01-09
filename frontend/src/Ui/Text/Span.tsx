import { Text } from "@radix-ui/themes";
import type { SpanProps } from "../../Types/Ui/Text/TextProps";

export default function Span({
	className = "",
	size = "4",
	...props
}: SpanProps) {
	return (
		<Text as="span" size={size} className={className} {...props} />
	);
}
