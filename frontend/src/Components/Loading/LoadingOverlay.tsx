interface LoadingOverlayProps {
	message?: string;
}

export function LoadingOverlay({
	message = "Carregando...",
}: LoadingOverlayProps) {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
			<div className="flex flex-col items-center">
				<div className="w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />

				{message && (
					<p className="mt-4 text-gray-600 font-medium">
						{message}
					</p>
				)}
			</div>
		</div>
	);
}
