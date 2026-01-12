<?php
namespace App\Traits;
use Illuminate\Support\Str;
trait hasUuid {


    protected static function bootHasUuid(){
        static::creating(function($model) {
           $model->uuid = empty($model->uuid) ? Str::uuid() : null;
        });
    }
}