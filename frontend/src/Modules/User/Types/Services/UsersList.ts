export interface UserListItem {
	id: number;
	uuid: string;
	name: string;
	email: string;
	role: string;
	status: string;
}

export interface PaginatedUsersResponse {
	data: UserListItem[];
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
