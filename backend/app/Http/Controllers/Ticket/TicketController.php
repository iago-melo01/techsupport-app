<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketRequest;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\Ticket\TicketService;
class TicketController extends Controller
{

    public function __construct(TicketService $ticketService){
        $this->ticketService = $ticketService; 
    }

    public function store(StoreTicketRequest $request){
        $this->authorize('create', User::class);

        $validatedData = $request->validated();

        return $this->ticketService->store($validatedData);
    }
}
