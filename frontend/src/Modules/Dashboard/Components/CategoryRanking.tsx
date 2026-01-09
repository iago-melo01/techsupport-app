interface CategoryRankingProps {
	categories: {
		name: string;
		count: number;
	}[];
}

export default function CategoryRanking({ categories }: CategoryRankingProps) {
	return (
		<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
			<h3 className="text-lg font-semibold text-gray-800 mb-4">
				Ranking de Categorias
			</h3>
			<div className="space-y-3">
				{categories.map((category, index) => (
					<div
						key={index}
						className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
					>
						<div className="flex items-center gap-3">
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
									index < 3
										? "bg-gray-700"
										: "bg-gray-400"
								}`}
							>
								{index + 1}
							</div>
							<span className="text-sm font-medium text-gray-700">
								{category.name}
							</span>
						</div>
						<span className="text-sm text-gray-600 font-semibold">
							{category.count}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
