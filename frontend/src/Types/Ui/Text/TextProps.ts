import { Text } from "@radix-ui/themes";
import type { ComponentProps, ReactNode } from "react";

export type SpanProps = ComponentProps<typeof Text> & {
	children: ReactNode;
};
