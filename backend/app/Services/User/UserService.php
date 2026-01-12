<?php

namespace App\Services\User;
use App\Models\User;
use Illuminate\Support\Facades\DB;
class UserService{

    public const PER_PAGE = 25;

    public function getAll(){
        $query = User::query()->where('status', 'active')->select('id','uuid','name','email','role','status');
        return $query->paginate(self::PER_PAGE);
    }

    public function store(array $data){

        if(!isset($data['status'])){
            $data['status'] = 'active';
        }

        
        return DB::transaction(function () use ($data) {
            $user = User::create($data);
        });
    }
}