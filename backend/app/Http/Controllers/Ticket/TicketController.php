<?php

namespace App\Http\Controllers\Ticket;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\StoreTicketRequest;
use App\Http\Requests\Ticket\UpdateTicketRequest;
use App\Models\Ticket;
use App\Services\Ticket\TicketService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TicketController extends Controller
{

    public function __construct(protected TicketService $ticketService) {}

    public function store(StoreTicketRequest $request)
    {
        $this->authorize('create', Ticket::class);

        $validatedData = $request->validated();

        $ticketCreated =  $this->ticketService->store($validatedData);

        return ApiResponse::success('Ticket created successfully', 201, ['data' => $ticketCreated]);
    }

    public function index()
    {
        $this->authorize('viewAny', Ticket::class);

        $ticketsArray = $this->ticketService->getAll();

        return ApiResponse::success('success', 200, ['data' => $ticketsArray]);
    }

    public function update(UpdateTicketRequest $request, string $uuid)
    {
        $data = $request->validated();

        $ticket = Ticket::where('uuid', $uuid)->firstOrFail();

        $this->authorize('update', $ticket);

        $updatedTicket = $this->ticketService->update($data, $ticket);

        return ApiResponse::success('Ticket Updated Successfully', 200, ['data' => $updatedTicket]);
    }
}
