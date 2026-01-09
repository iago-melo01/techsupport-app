interface LoadingScreenProps {
	message?: string;
}

export function LoadingScreen({
	message = "Carregando...",
}: LoadingScreenProps) {
	return (
		<div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
			<div className="text-center">
				<div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
				<p className="text-gray-600 font-medium">{message}</p>
			</div>
		</div>
	);
}
