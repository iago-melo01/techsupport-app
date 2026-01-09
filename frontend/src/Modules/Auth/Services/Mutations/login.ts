import { DataService } from "@/Lib/DataService";
import type {
	LoginPayload,
	LoginResponse,
} from "@/Modules/Auth/Types/Services/Login";
import { mutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const login = mutationOptions<
	LoginResponse,
	AxiosError,
	LoginPayload
>({
	mutationFn: async (payload: LoginPayload) => {
		const res = await DataService.post("/auth/login", payload);
		return res.data;
	},
});
