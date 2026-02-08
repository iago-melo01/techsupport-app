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

    

    public function getTickets()
    {

        $tickets = $this->ticketService->getTickets();
        return ApiResponse::success('success', 200, ['data' => $tickets]);
    }

    public function index()
    {
        $this->authorize('viewAny', Ticket::class);

        $ticketsArray = $this->ticketService->getAll();

        return ApiResponse::success('success', 200, ['data' => $ticketsArray]);
    }

    
}
