import { Theme } from "@radix-ui/themes";
import { RouterProvider } from "react-router-dom";
import {
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./Router/router";
import { AuthProvider } from "./Context/AuthContext";
import { Suspense } from "react";
import { LoadingOverlay } from "./Components/Loading/LoadingOverlay";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Theme>
				<AuthProvider>
					<Suspense
						fallback={
							<LoadingOverlay message="Carregando aplicação..." />
						}
					>
						<RouterProvider router={router} />
					</Suspense>
				</AuthProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</Theme>
		</QueryClientProvider>
	);
}
