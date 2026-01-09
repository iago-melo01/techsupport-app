export interface UserProps {
	uuid: string;
	name: string;
	email: string;
	role: "user" | "agent" | "admin";
}
