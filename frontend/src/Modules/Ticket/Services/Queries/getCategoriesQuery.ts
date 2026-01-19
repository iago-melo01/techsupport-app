import { queryOptions } from "@tanstack/react-query";
import { DataService } from "@/Lib/DataService";
import type { Category } from "@/Modules/Ticket/Types/Services/Category";
import { QUERY_KEYS } from "@/Constants/Service/QueryKeys";

export const getCategoriesQuery = queryOptions<Category[]>({
	queryKey: QUERY_KEYS.CATEGORY.LIST,
	queryFn: async () => {
		const response = await DataService.get("/categories");
		
		// O backend retorna: { success: true, message: 'success', data: { data: [...], current_page: ... } }
		// O CategoryService retorna paginate(), então os dados estão em response.data.data.data
		
		// Tenta acessar response.data.data (que é o objeto de paginação do Laravel)
		const paginationData = response.data?.data;
		
		// Se paginationData tem uma propriedade 'data' que é um array, é paginação
		if (paginationData && typeof paginationData === 'object' && 'data' in paginationData && Array.isArray(paginationData.data)) {
			return paginationData.data;
		}
		
		// Se response.data.data já é um array diretamente, retorna
		if (Array.isArray(paginationData)) {
			return paginationData;
		}
		
		// Se response.data é um array, retorna diretamente
		if (Array.isArray(response.data)) {
			return response.data;
		}
		
		// Fallback: retorna array vazio
		console.warn('Estrutura de resposta inesperada de /categories:', response.data);
		return [];
	},
	staleTime: 1000 * 60 * 10, // 10 minutos
	gcTime: 1000 * 60 * 30, // 30 minutos
});
