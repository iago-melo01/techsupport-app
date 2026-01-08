<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Request;
use App\Services\AuthService;
class AuthController extends Controller{


    public function __construct(protected AuthService $authservice){
        $this->authservice = $authservice;
    }


    public function me(){
        return $this->authservice->me();
    }
    
    public function login(LoginRequest $request){
        $request->ensureIsNotRateLimited();

        //retorna um array com os dados contidos na funcao rules() do LoginRequest
        $credentials = $request->validated(); 
        
        $credentials['throttleKey'] = $request->throttleKey();
        
        return $this->authservice->login($credentials);
    }

    //Não passamos request já que os parametros sao enviados no cookie
    //Então não haverá nenhum dado sendo passado pelo body, o que faz desnecssario um request
    public function refresh(){

        return $this->authservice->refresh();
    }
}