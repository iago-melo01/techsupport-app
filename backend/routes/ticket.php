<?php

use App\Http\Controllers\Ticket\TicketController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->group(function () {


    Route::prefix('tickets/')->group(function (){
        Route::post('create/', [TicketController::class, 'store'])->name('tickets.store');
    });
});