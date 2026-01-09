interface TicketsByStatusChartProps {
	data: {
		status: string;
		count: number;
		color: string;
	}[];
}

export default function TicketsByStatusChart({
	data,
}: TicketsByStatusChartProps) {
	const maxCount = Math.max(...data.map((d) => d.count), 1);

	return (
		<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
			<h3 className="text-lg font-semibold text-gray-800 mb-4">
				Tickets por Status
			</h3>
			<div className="space-y-3">
				{data.map((item, index) => (
					<div key={index}>
						<div className="flex justify-between items-center mb-1">
							<span className="text-sm font-medium text-gray-700 capitalize">
								{item.status.replace("_", " ")}
							</span>
							<span className="text-sm text-gray-600">{item.count}</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2.5">
							<div
								className={`h-2.5 rounded-full ${item.color}`}
								style={{
									width: `${(item.count / maxCount) * 100}%`,
								}}
							></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
