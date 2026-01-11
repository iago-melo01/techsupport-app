<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
Route::prefix('auth')->group(function () {

    Route::post('refresh/', [AuthController::class, 'refresh'])->name('auth.refresh');;
    Route::post('login/', [AuthController::class, 'login'])->name('auth.login');
    Route::post('logout/', [AuthController::class, 'logout'])->middleware('auth:api')->name('auth.logout');
    Route::get('me/', [AuthController::class, 'me'])->middleware('auth:api')->name('auth.me');
});

