<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\ForceJsonResponse;
use App\Http\Middleware\CheckRole;
use App\Http\Middleware\CheckTokenExpiration;
use App\Http\Middleware\HandleCors;
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        apiPrefix: 'api',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Middleware CORS deve ser o primeiro para lidar com preflight requests
        $middleware->prepend(HandleCors::class);
        
        //Força o retorno de resposta em Json para qualquer requisicao feita no grupo
        // de rotas chamado api
        $middleware->prependToGroup('api', [ForceJsonResponse::class]); 
       
        //Cria um alias 'role' para o middleware CheckRole
        $middleware->alias(['role' => CheckRole::class]); 

        //Cria um alias 'auth' para o middleware CheckTokenExpiration
        $middleware->alias(['auth' => CheckTokenExpiration::class]);

        //Confia em qualquer proxy para descobrir o ip verdadeiro de quem enviou a requisição
        $middleware->trustProxies(at: '*');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
