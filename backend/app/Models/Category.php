<?php

namespace App\Models;
use App\Traits\hasUuid;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{

    use hasUuid;
    
    protected $fillable = [
        'uuid',
        'name',
        'description',
    ];
}
