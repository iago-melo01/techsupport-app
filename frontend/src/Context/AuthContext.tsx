import {
	createContext,
	useContext,
	useMemo,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuthUserQuery } from "@/Modules/Auth/Services/Queries/getAuthUserQuery";
import { getToken } from "@/Lib/Token";
import { LoadingScreen } from "@/Components/Loading/LoadingScreen";
import type { UserProps } from "@/Types/Entity/UserProps";

interface AuthContextType {
	user: UserProps | undefined;
	isPending: boolean;
	isError: boolean;
	refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(getToken());

	const { data, isPending, isError, refetch } = useQuery({
		...getAuthUserQuery,
		enabled: !!token,
	});

	// Escuta mudanças no token: atualiza estado (para habilitar query) e faz refetch
	useEffect(() => {
		const handleTokenChange = () => {
			const currentToken = getToken();
			setToken(currentToken);
		};

		window.addEventListener("token-changed", handleTokenChange);

		return () => {
			window.removeEventListener("token-changed", handleTokenChange);
		};
	}, []);

	const value = useMemo(
		() => ({
			user: data,
			isPending,
			isError,
			refetchUser: refetch,
		}),
		[data, isPending, isError, refetch]
	);

	if (!token) {
		return (
			<AuthContext.Provider
				value={{
					user: undefined,
					isPending: false,
					isError: false,
					refetchUser: refetch,
				}}
			>
				{children}
			</AuthContext.Provider>
		);
	}

	if (isPending) return <LoadingScreen />;

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error("useAuthContext deve ser usado dentro do AuthProvider");
	return context;
}
