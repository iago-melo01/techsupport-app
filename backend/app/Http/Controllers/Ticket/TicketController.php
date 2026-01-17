<?php

namespace App\Http\Controllers\Ticket;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\StoreTicketRequest;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\Ticket\TicketService;
class TicketController extends Controller
{

    public function __construct(protected TicketService $ticketService){
        $this->ticketService = $ticketService; 
    }

    public function store(StoreTicketRequest $request){
        $this->authorize('create', User::class);

        $validatedData = $request->validated();

        $userCreated =  $this->ticketService->store($validatedData);

        return ApiResponse::success('User created successfully', 201, ['data' => $validatedData]);
    }
}
