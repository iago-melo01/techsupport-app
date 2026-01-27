import { DataService } from "@/Lib/DataService";
import type {
	UpdateTicketPayload,
	UpdateTicketResponse,
} from "@/Modules/Ticket/Types/Services/UpdateTicket";
import { mutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const updateTicket = mutationOptions<
	UpdateTicketResponse,
	AxiosError,
	{ uuid: string; payload: UpdateTicketPayload }
>({
	mutationFn: async ({ uuid, payload }) => {
		const res = await DataService.put(`/tickets/${uuid}/update`, payload);
		return res.data;
	},
});
