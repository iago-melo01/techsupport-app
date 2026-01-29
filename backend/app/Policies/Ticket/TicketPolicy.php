<?php

namespace App\Policies\Ticket;


use App\Policies\BasePolicy\BasePolicy;
use App\Models\Ticket;
use App\Models\User;

class TicketPolicy extends BasePolicy
{

    public function before(?User $user, string $ability)
    {
        // Se não há usuário autenticado, nega acesso
        if (!$user) {
            return false;
        }

        // Se é admin, permite tudo
        if ($user->isAdmin()) {
            return true;
        }

        //retorna null para continuar para os outros métodos
        return null;
    }

    public function create(User $user)
    {
        return $user->isAdmin() || $user->isUser();
    }

    public function view(User $user, Ticket $ticket)
    {
        if ($user->isTechnician()) {
            return true;
        }
        return ($user->id === $ticket->user_id) ? true : false;
    }


    public function viewAny(User $user)
    {
        return $user->isAdmin() || $user->isTechnician();
        // tanto usuarios como tecnicos como admin devem ser capazes de visualizar os tickets
    }

    public function update(User $user)
    {
        return $user->isAdmin() || $user->isTechnician();
    }
}
