import { DataService } from "@/Lib/DataService";
import { mutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const logout = mutationOptions<{ message: string }, AxiosError, void>({
	mutationFn: async () => {
		const res = await DataService.post("/auth/logout");
		return res.data;
	},
});
