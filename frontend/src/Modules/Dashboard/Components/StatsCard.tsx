import { Info } from "lucide-react";

interface StatsCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	trend?: {
		label: string;
		value: string;
		isPositive?: boolean;
	};
	icon?: React.ReactNode;
	className?: string;
}

export default function StatsCard({
	title,
	value,
	subtitle,
	trend,
	icon,
	className = "",
}: StatsCardProps) {
	return (
		<div
			className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 ${className}`}
		>
			<div className="flex items-start justify-between mb-4">
				<div>
					<p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
					<p className="text-3xl font-bold text-gray-900">{value}</p>
				</div>
				{icon && <div className="text-gray-400">{icon}</div>}
				<Info className="w-5 h-5 text-gray-400 cursor-help" />
			</div>

			{subtitle && (
				<p className="text-sm text-gray-500 mb-2">{subtitle}</p>
			)}

			{trend && (
				<div className="flex items-center gap-2 mt-2">
					<span
						className={`text-sm font-medium ${
							trend.isPositive ? "text-green-600" : "text-red-600"
						}`}
					>
						{trend.label} {trend.value}
					</span>
					{trend.isPositive ? (
						<span className="text-green-600">↑</span>
					) : (
						<span className="text-red-600">↓</span>
					)}
				</div>
			)}
		</div>
	);
}
