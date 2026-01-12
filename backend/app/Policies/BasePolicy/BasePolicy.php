<?php

namespace App\Policies\BasePolicy;
use App\Services\User\UserService;

class BasePolicy{
    public function __construct (protected UserService $userService) {
        $this->userService = $userService;
    }
}
