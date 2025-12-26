<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Request;
class AuthController extends Controller{

    public function refresh(Request $request){
        // Lógica
        return ApiResponse::success('Token atualizado com sucesso');
    }
}