<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class StoreUserRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            // sintaxe do unique ( unique:tabela,coluna)
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::in('admin', 'technician', 'user')],
            'phone' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'string', Rule::in('active', 'inactive')],
        ];
    }

    public function messages(): array{
        return [
            'name.required' => 'O nome é obrigatório',
            'email.required' => 'O email é obrigatório',
            'email.email' => 'O email deve ser um email válido',
            'email.unique' => 'O email já está em uso',
            'password.required' => 'A senha é obrigatória',
            'password.string' => 'A senha deve ser uma string',
            'password.min' => 'A senha deve ter pelo menos 8 caracteres',
        ];
    }
}
