export interface CreateUserPayload {
	name: string;
	email: string;
	password: string;
	role: "admin" | "technician" | "user";
	phone?: string | null;
	status?: "active" | "inactive";
}

export interface CreateUserResponse {
	id: number;
	uuid: string;
	name: string;
	email: string;
	role: string;
	status: string;
	created_at: string;
	updated_at: string;
}
