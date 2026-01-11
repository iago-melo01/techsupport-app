<?php

namespace App\Services\User;
use App\Models\User;
class UserService{

    public const PER_PAGE = 25;

    public function getAll(){
        $query = User::query()->where('status', 'active')->select('id','uuid','name','email','role','status');
        return $query->paginate(self::PER_PAGE);
    }
}