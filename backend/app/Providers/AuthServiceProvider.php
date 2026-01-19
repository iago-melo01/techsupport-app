<?php

namespace App\Providers;

use App\Models\Ticket;
use App\Models\User;
use App\Policies\Category\CategoryPolicy;
use App\Policies\Ticket\TicketPolicy;
use App\Policies\User\UserPolicy;
use App\Models\Category;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
class AuthServiceProvider extends ServiceProvider{
    
    protected $policies = [
        User::class => UserPolicy::class,
        Ticket::class => TicketPolicy::class,
        Category::class => CategoryPolicy::class,
    ];


    public function boot(): void
    {
        $this->registerPolicies();
    }
}
