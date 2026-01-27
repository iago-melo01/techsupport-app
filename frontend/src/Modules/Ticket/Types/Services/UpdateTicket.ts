export interface UpdateTicketPayload {
	status?: "Open" | "Closed" | "Reviewing" | "Solved";
	title?: string;
	description?: string;
	technician_uuid?: string | null;
	category_uuid?: string;
}

export interface UpdateTicketResponse {
	success: boolean;
	message: string;
	data?: {
		uuid: string;
		status: string;
		title: string;
		description: string;
		category: {
			id: number;
			name: string;
			description: string;
		};
		user: {
			id: number;
			name: string;
		};
		technician: {
			id: number;
			name: string;
		} | null;
	};
}
