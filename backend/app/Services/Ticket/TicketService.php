<?php

namespace App\Services\Ticket;

use App\Models\Category;
use Illuminate\Support\Facades\DB;
use App\Models\Ticket;
use App\Models\User;
use Exception;
use Illuminate\Support\Arr;

class TicketService
{
    public function store(array $credentials)
    {
        return DB::transaction(function () use ($credentials) {

            $category_uuid = Arr::pull($credentials, 'category_uuid');
            $category = Category::where('uuid', $category_uuid)->first();

            if (!$category) {
                throw new Exception('Categoria não existente', 404);
            }

            $credentials['category_id'] = $category->id;

            $user = auth('api')->user();

            $credentials['user_id'] = $user->id;
            $ticket = Ticket::create($credentials);

            return $ticket;
        });
    }

    public function getAll()
    {
        return Ticket::query()->with(['category:id,name,description', 'user:id,name', 'technician:id,name'])->select([
            'uuid',
            'status',
            'title',
            'description',
            'user_id',
            'technician_id',
            'category_id',
        ])->paginate(25);
    }

    public function getTickets()
    {
        $user = auth('api')->user();
        $query = Ticket::with(['category:id,name,description', 'user:id,name', 'technician:id,name'])
            ->where('user_id', $user->id)->select(
                [
                    'uuid',
                    'title',
                    'status',
                    'description',
                    'user_id',
                    'technician_id',
                    'category_id'
                ]
            )
            ->paginate(25);

        return $query;
    }

    public function findByUuid(string $uuid): Ticket{
        return Ticket::where('uuid', $uuid)->firstOrFail();
    }

    

    public function update(array $data, Ticket $ticket): Ticket
    {

        $originalAttributes = $ticket->getAttributes();

        if (isset($data['technician_uuid'])) {
            $technician = User::where('uuid', Arr::pull($data, 'technician_uuid'))->firstOrFail();
            $data['technician_id'] = $technician->id;
        }

        if (isset($data['category_uuid'])) {
            $category = Category::where('uuid', Arr::pull($data, 'category_uuid'))->firstOrFail();
            $data['category_id'] = $category->id;
        }


        $ticket->fill($data);

        $attributesChanged = $ticket->isDirty();
        if (!$attributesChanged) {
            return $ticket->load(['category', 'technician', 'user']);
        }

        return DB::transaction(function () use ($ticket) {
            $ticket->save();

            return $ticket->fresh(['category', 'technician', 'user']);
        });
    }
}
