export interface TicketListItem {
	uuid: string;
	status: string;
	title: string;
	description: string;
	user_id: number;
	technician_id: number | null;
	category_id: number;
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
}

export interface PaginatedTicketsResponse {
	data: TicketListItem[];
	current_page: number;
	first_page_url: string;
	from: number | null;
	last_page: number;
	last_page_url: string;
	links: Array<{
		url: string | null;
		label: string;
		active: boolean;
	}>;
	next_page_url: string | null;
	path: string;
	per_page: number;
	prev_page_url: string | null;
	to: number | null;
	total: number;
}
