export interface CreateTicketPayload {
	title: string;
	description: string;
	category_uuid: string;
}

export interface CreateTicketResponse {
	success: boolean;
	message: string;
	data?: {
		title: string;
		description: string;
		category_uuid: string;
	};
}
