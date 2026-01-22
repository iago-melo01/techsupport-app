<?php

namespace App\Services\Ticket;

use App\Helpers\ApiResponse;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use App\Models\Ticket;
use Exception;
use Illuminate\Support\Arr;

class TicketService {
    public function store(array $credentials){
        return DB::transaction(function () use ($credentials){

            $category_uuid = Arr::pull($credentials, 'category_uuid');
            $category = Category::where('uuid', $category_uuid)->first();

            if(!$category){
                throw new Exception('Categoria não existente', 404);
            }

            $credentials['category_id'] = $category->id;

            $user = auth('api')->user();

            $credentials['user_id'] = $user->id;
            $ticket = Ticket::create($credentials);

            return $ticket;
        });


    }

    public function getAll(){
        return Ticket::query()->with('category:name,description')->select([
            'uuid',
            'status', 
            'title', 
            'description', 
            'user_id', 
            'technician_id',
            'category_id',])->paginate(25);
    }
}