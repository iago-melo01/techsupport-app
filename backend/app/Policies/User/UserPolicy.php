<?php
namespace App\Policies\User;
use App\Policies\BasePolicy\BasePolicy;
use App\Models\User;
class UserPolicy extends BasePolicy{

    public function before(?User $user, string $ability) {
        // Se não há usuário autenticado, nega acesso
        if (!$user) {
            return false;
        }
        
        // Se é admin, permite tudo
        if($user->isAdmin()) {
            return true;
        }
        
        // Retorna null para continuar para os outros métodos
        return null;
    }

    public function create(User $user){
        return $user->isAdmin();
    }

    public function update(User $user, User $model){
        return $user->isAdmin();
    }

    public function delete(User $user, User $model){
        return $user->isAdmin();
    }
    
    public function view(User $user, User $model){
        return $user->isAdmin();
    }
    
    public function viewAny(User $user){
        return $user->isAdmin();
    }
}