<?php

namespace App\Services\Ticket;
use Illuminate\Support\Facades\DB;
use App\Models\Ticket;
class TicketService {
    public function store(array $credentials){
        return DB::transaction(function () use ($credentials){

            $ticket = Ticket::create($credentials);
        });


    }
}