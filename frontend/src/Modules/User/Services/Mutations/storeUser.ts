import { DataService } from "@/Lib/DataService";
import type {
	CreateUserPayload,
	CreateUserResponse,
} from "@/Modules/User/Types/Services/CreateUser";
import { mutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const storeUser = mutationOptions<
	CreateUserResponse,
	AxiosError,
	CreateUserPayload
>({
	mutationFn: async (payload: CreateUserPayload) => {
		const res = await DataService.post("/admin/users", payload);
		return res.data;
	},
});
