<?php

namespace App\Http\Controllers\Category;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Services\Category\CategoryService;

class CategoryController extends Controller
{
    public function __construct(protected CategoryService $categoryService){
        $this->categoryService = $categoryService;
    }

    public function index(){
        $this->authorize('view', Category::class);

        $query = $this->categoryService->getAll();

        return ApiResponse::success('success', 200, ['data' => $query]);
    }
}
