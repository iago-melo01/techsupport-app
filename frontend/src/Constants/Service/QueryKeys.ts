export const QUERY_KEYS = {
	USER: {
		AUTH: ["user", "auth"],
		LIST: ["users", "list"],
	},
	CATEGORY: {
		LIST: ["categories", "list"],
	},
	TICKET: {
		LIST: ["tickets", "list"],
		MY_LIST: ["tickets", "my-list"],
	},
} as const;
