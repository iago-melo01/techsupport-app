import { useState } from "react";
import CreateTicketForm from "@/Modules/Ticket/Components/CreateTicketForm";
import { useNavigate } from "react-router-dom";

export default function CreateTicketPage() {
	const navigate = useNavigate();
	const [showForm, setShowForm] = useState(true);

	return (
		<div className="p-6">
			{showForm && (
				<CreateTicketForm
					onClose={() => {
						setShowForm(false);
						navigate(-1);
					}}
					onSuccess={() => {
						setShowForm(false);
						navigate(-1);
					}}
				/>
			)}
		</div>
	);
}
