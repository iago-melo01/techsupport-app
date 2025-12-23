<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;

class ApiResponse {

    //assume por padrao um status code de 200, mas pode ser passado como parametro outro também
    public static function success(string $message, int $status = 200, array $extra = []): JsonResponse{
        return response()->json(
            array_merge([// merge dois arrays e retorna um só
            'success' => true,
            'message' => $message,
        ], $extra), $status);    
    }

    public static function error(string $message, int $status = 400, array $extra = []): JsonResponse{
        return response()->json(
            array_merge([
                'success' => false,
                'message' => $message,
            ], $extra), $status);
    }

}