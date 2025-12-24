<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array 
    {
        return [
            'email.required' => 'O email é obrigatório',
            'email.email' => 'O email deve ser um email válido',
            'password.required' => 'A senha é obrigatória',
            'password.string' => 'A senha deve ser uma string',

        ];
    }


    /**
     * Indica ao Laravel qual campo usar como "username" para autenticação.
     */
    public function username(): string 
    {
        return 'email';
    }


    
    public function ensureIsNotRateLimited(){
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }
        //registra um novo evento de lockout com a requisicao atual
        //Lockout evento é disparado quando o usuario tenta login demais
        event(new Lockout($this)); 

        //availableIn retorna o tempo em segundos que o usuario deve
        //esperar pra tentar novamente
        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => 'Você fez muitas tentativas de login. Tente novamente em ' . ceil($seconds / 60) . ' minutos.',
        ]);

    }


    protected function normalizedEmail(): string
    {
        return Str::lower(trim($this->input('email')));
    }


    public function throttleKey(): string 
    {
        return $this->normalizedEmail() . '|' . $this->ip();
    }
}
