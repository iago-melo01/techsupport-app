<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Gate;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\User\UserService;
use App\Http\Requests\User\StoreUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
class UserController extends Controller
{

    public function __construct(protected UserService $userservice){
        $this->userservice = $userservice;
    }
    public function index(){
        
        $this->authorize('viewAny', User::class);
        
        return $this->userservice->getAll();
    }

    public function store(StoreUserRequest $request){

        $this->authorize('create', User::class);

        //recieves validated data from the request
        $validatedData = $request->validated();

        return $this->userservice->store($validatedData);
    }
}
