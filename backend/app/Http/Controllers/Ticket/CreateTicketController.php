<?php
namespace App\Http\Controllers\Ticket;

use App\Http\Requests\Ticket\StoreTicketRequest;
use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Services\Ticket\TicketService;
use App\Helpers\ApiResponse;


class CreateTicketController extends Controller{

    public function __construct(protected TicketService $ticketService) {}

    public function store(StoreTicketRequest $request)
    {
        $this->authorize('create', Ticket::class);

        $validatedData = $request->validated();

        $ticketCreated =  $this->ticketService->store($validatedData);

        return ApiResponse::success('Ticket created successfully', 201, ['data' => $ticketCreated]);
    }
}