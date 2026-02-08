<?php

namespace App\Http\Controllers\Ticket;
use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\UpdateTicketRequest;
use App\Models\Ticket;
use App\Helpers\ApiResponse;
use App\Services\Ticket\TicketService;

class UpdateTicketController extends Controller{


    public function __construct(protected TicketService $ticketService) {}

    public function update(UpdateTicketRequest $request, string $uuid)
    {
        $data = $request->validated();

        $ticket = $this->ticketService->findByUuid($uuid);

        $this->authorize('update', $ticket);

        $updatedTicket = $this->ticketService->update($data, $ticket);

        return ApiResponse::success('Ticket Updated Successfully', 200, ['data' => $updatedTicket]);
    }
}