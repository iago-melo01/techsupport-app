import { queryOptions } from "@tanstack/react-query";
import { DataService } from "@/Lib/DataService";
import type { PaginatedTicketsResponse } from "@/Modules/Ticket/Types/Services/TicketsList";
import { QUERY_KEYS } from "@/Constants/Service/QueryKeys";

export const getMyTicketsQuery = (page: number = 1) =>
	queryOptions<PaginatedTicketsResponse>({
		queryKey: [...QUERY_KEYS.TICKET.MY_LIST, page],
		queryFn: async () => {
			const response = await DataService.get("/users/tickets", {
				params: { page },
			});
			return response.data.data;
		},
		staleTime: 1000 * 60 * 5, // 5 minutos
		gcTime: 1000 * 60 * 20, // 20 minutos
	});
