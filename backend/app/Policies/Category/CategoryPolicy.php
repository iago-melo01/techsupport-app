<?php

namespace App\Policies\Category;

use App\Models\Category;
use App\Models\User;

class CategoryPolicy
{
   public function view(User $user){
        return true;
   }

   public function viewAny(User $user){
        return true;
   }
   
}
