<?php

namespace App\Http\Controllers\Ticket;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\StoreTicketRequest;
use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Services\Ticket\TicketService;
class TicketController extends Controller
{

    public function __construct(protected TicketService $ticketService){
        $this->ticketService = $ticketService; 
    }

    public function store(StoreTicketRequest $request){
        $this->authorize('create', Ticket::class);

        $validatedData = $request->validated();

        $userCreated =  $this->ticketService->store($validatedData);

        return ApiResponse::success('Ticket created successfully', 201, ['data' => $validatedData]);
    }
}
