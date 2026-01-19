<?php

namespace App\Services\Category;

use App\Models\Category;

class CategoryService{
    public function getAll(){
        $query = Category::query()->select(['uuid', 'name', 'description']);
        return $query->paginate(50);
    }
}