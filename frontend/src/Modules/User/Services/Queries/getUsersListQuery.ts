import { queryOptions } from "@tanstack/react-query";
import { DataService } from "@/Lib/DataService";
import type { PaginatedUsersResponse } from "@/Modules/User/Types/Services/UsersList";
import { QUERY_KEYS } from "@/Constants/Service/QueryKeys";

export const getUsersListQuery = (page: number = 1) =>
	queryOptions<PaginatedUsersResponse>({
		queryKey: [...QUERY_KEYS.USER.LIST, page],
		queryFn: async () => {
			const response = await DataService.get("/admin/users", {
				params: { page },
			});
			return response.data;
		},
		staleTime: 1000 * 60 * 5, // 5 minutos
		gcTime: 1000 * 60 * 20, // 20 minutos
	});
