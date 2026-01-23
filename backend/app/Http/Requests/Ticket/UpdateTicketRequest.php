<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTicketRequest extends FormRequest
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

            'status' => ['sometimes', 'string', Rule::in(['Open', 'Closed', 'Reviewing', 'Solved'])],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'user_uuid' => ['sometimes', 'uuid', 'exists:users,uuid'],
            'technician_uuid' => ['nullable', 'uuid', 'exists:users,uuid'],
            'category_uuid' => ['sometimes', 'uuid', 'exists:categories,uuid'],

        ];
    }
    public function messages(): array
    {
        return [
            'status.string' => 'O status deve ser um texto.',
            'status.in' => 'O status deve ser: Open, Closed, Reviewing ou Solved.',

            'title.string' => 'O título deve ser um texto.',
            'title.max' => 'O título deve ter no máximo 255 caracteres.',

            'description.string' => 'A descrição deve ser um texto.',

            'user_uuid.uuid' => 'O UUID do usuário é inválido.',
            'user_uuid.exists' => 'O usuário informado não existe.',

            'technician_uuid.uuid' => 'O UUID do técnico é inválido.',
            'technician_uuid.exists' => 'O técnico informado não existe.',

            'category_uuid.uuid' => 'O UUID da categoria é inválido.',
            'category_uuid.exists' => 'A categoria informada não existe.',
        ];
    }
}
