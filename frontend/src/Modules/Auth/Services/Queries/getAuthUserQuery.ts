import { queryOptions } from "@tanstack/react-query";
import { DataService } from "@/Lib/DataService";
import type { UserProps } from "@/Types/Entity/UserProps";
import { QUERY_KEYS } from "@/Constants/Service/QueryKeys";

export const getAuthUserQuery = queryOptions<UserProps>({
	queryKey: QUERY_KEYS.USER.AUTH,
	queryFn: async () => {
		const response = await DataService.get("/auth/me");
		return response.data.user;
	},
	retry: false,
	staleTime: 1000 * 60 * 5,
	gcTime: 1000 * 60 * 20,
});
