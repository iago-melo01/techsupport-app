<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
Route::middleware('auth:api')->group(function (){

    Route::prefix('admin/')->group(function (){ 
        Route::get('users/', [UserController::class, 'index'])->name('users.index');
        Route::post('users/', [UserController::class, 'store'])->name('users.store');
    });
    
});

?>