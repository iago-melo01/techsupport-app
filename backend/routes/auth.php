<?php

use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {

    Route::post('refresh/', [AuthController::class, 'refresh'])->name('auth.refresh');;
    Route::post('login/', [AuthController::class, 'login'])->name('auth.login');
    Route::post('logout/', [AuthController::class, 'logout'])->name('auth.logout');
});

