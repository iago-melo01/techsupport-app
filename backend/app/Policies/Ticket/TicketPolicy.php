<?php

namespace App\Policies;


use App\Policies\BasePolicy\BasePolicy;
use App\Models\Ticket;
use App\Models\User;
class TicketPolicy extends BasePolicy
{
    

    public function create(User $user){
        return $user->isAdmin() || $user->isUser();
    }

    public function view(User $user, Ticket $ticket){
        return $user->isAdmin() || $user->isTechnician() 
        || ($ticket->user_id === $user->id);// tanto usuarios como tecnicos como admin devem ser capazes de visualizar os tickets
    }
}
