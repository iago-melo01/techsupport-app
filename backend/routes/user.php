<?php

use App\Http\Controllers\Ticket\TicketController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::middleware('auth:api')->group(function () {

    Route::prefix('users/')->group(function () {
        Route::get('tickets', [TicketController::class, 'getTickets'])->name('user.tickets');
    });

    Route::prefix('admin/')->group(function () {
        Route::get('users/', [UserController::class, 'index'])->name('users.index');
        Route::post('users/', [UserController::class, 'store'])->name('users.store');
    });
});
