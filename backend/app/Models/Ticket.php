<?php

namespace App\Models;
use App\Traits\hasUuid;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Category;
class Ticket extends Model
{
    use hasUuid;
    
    protected $fillable = [
        'uuid',
        'status',
        'title',
        'description',
        'user_id',
        'technician_id',
        'category_id',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function technician(){
        return $this->belongsTo(User::class, 'technician_id');
    }

    
    public function category(){
        //sintaxe: Ticket possui uma entidade category, cuja chave estrangeira está armazenada em category_id
        return $this->belongsTo(Category::class, 'category_id');
    }
}
