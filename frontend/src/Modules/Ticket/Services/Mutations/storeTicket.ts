import { DataService } from "@/Lib/DataService";
import type {
	CreateTicketPayload,
	CreateTicketResponse,
} from "@/Modules/Ticket/Types/Services/CreateTicket";
import { mutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const storeTicket = mutationOptions<
	CreateTicketResponse,
	AxiosError,
	CreateTicketPayload
>({
	mutationFn: async (payload: CreateTicketPayload) => {
		const res = await DataService.post("/tickets/create", payload);
		return res.data;
	},
});
