<?php

use App\Http\Controllers\Ticket\CreateTicketController;
use App\Http\Controllers\Ticket\TicketController;
use App\Http\Controllers\Ticket\UpdateTicketController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->group(function () {

    Route::prefix('tickets')->group(function () {
        Route::get('/', [TicketController::class, 'index'])->name('tickets.name');
        Route::post('/create', [CreateTicketController::class, 'store'])->name('tickets.store');

        Route::prefix('/{uuid}')->group(function () {
            Route::put('/update', [UpdateTicketController::class, 'update'])->name('tickets.update');
        });
    });
});
