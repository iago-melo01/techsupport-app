<?php

use App\Http\Controllers\Ticket\TicketController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->group(function () {

    Route::prefix('tickets')->group(function () {
        Route::get('/', [TicketController::class, 'index'])->name('tickets.name');
        Route::post('/create', [TicketController::class, 'store'])->name('tickets.store');

        Route::prefix('/{uuid}')->group(function () {
            Route::put('/update', [TicketController::class, 'update'])->name('tickets.update');
        });
    });
});
