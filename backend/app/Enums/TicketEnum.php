<?php

namespace App\Enums;

enum TicketEnum: string
{
    case OPEN = 'Open';
    case CLOSED = 'Closed';
    case REVIEWING = 'Reviewing';
    case SOLVED = 'Solved';

    public static function values(): array
    {
        return array_column(self::cases(), 'value'); // retorna o valor da chave 'value' do array de objetos Enum
        //Esse objeto fica estruturado mais ou menos com duas chaves, 'name' e 'value',
        //o array column percorre cada item do array de Enums e pega o valor da chave 'value'
        //ex: ['name' => 'ACTIVE',      'value' => 'active'],
    }

    public function label()
    {
        return match ($this) {
            self::OPEN => 'Aberto',
            self::CLOSED => 'Fechado',
            self::REVIEWING => 'Revisando',
            self::SOLVED => 'Resolvido'
        };
    }

    public static function options()
    {
        //retorna todas as opções de Enum e suas respectivas labels
        return collect(self::cases())->map(fn($case) => ['value' => $case->value, 'label' => $case->label()]);
    }
}
