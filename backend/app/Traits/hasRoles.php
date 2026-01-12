<?php
namespace App\Traits;

trait hasRoles {

    public function isAdmin(){
        return $this->role === 'admin';
    }

    public function isTechnician(){
        return $this->role === 'technician';
    }

    public function isUser(){
        return $this->role === 'user';
    }
}