<?php
namespace App\Policies\User;
use App\Policies\BasePolicy\BasePolicy;
use App\Models\User;
class UserPolicy extends BasePolicy{

    public function before(User $user, string $ability) {
        if($user->isAdmin())
            return true;
        
    }

    public function create(User $user){
        if($user->isAdmin())
            return true;
    }

    public function update(User $user, User $model){
        if($user->isAdmin())
            return true;
    }

    public function delete(User $user, User $model){
        if($user->isAdmin())
            return true;
    }
    public function view(User $user, User $model){
        if($user->isAdmin())
            return true;
    }
    public function viewAny(User $user){
        if($user->isAdmin())
            return true;
    }
}
