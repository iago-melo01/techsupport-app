<?php

namespace App\Http\Controllers\Ticket;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\StoreTicketRequest;
use App\Http\Requests\Ticket\UpdateTicketRequest;
use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Services\Ticket\TicketService;

class TicketController extends Controller
{

    public function __construct(protected TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    public function store(StoreTicketRequest $request)
    {
        $this->authorize('create', Ticket::class);

        $validatedData = $request->validated();

        $userCreated =  $this->ticketService->store($validatedData);

        return ApiResponse::success('Ticket created successfully', 201, ['data' => $validatedData]);
    }

    public function index()
    {
        $this->authorize('viewAny', Ticket::class);

        $ticketsArray = $this->ticketService->getAll();

        return ApiResponse::success('success', 200, ['data' => $ticketsArray]);
    }

    public function update(UpdateTicketRequest $request)
    {
        $data = $request->validated();

        $this->authorize('update', Ticket::class);

        $updatedUser = $this->ticketService->update($data);

        return ApiResponse::success('Ticket Updated Successfully', 200, ['data' => $updatedUser]);
    }
}
