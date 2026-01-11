<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\User\UserService;
class UserController extends Controller
{

    public function __construct(protected UserService $userservice){
        $this->userservice = $userservice;
    }
    public function index(){
        return $this->userservice->getAll();
    }
}
