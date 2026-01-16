<?php
namespace App\Traits;
use Illuminate\Support\Str;
trait hasUuid {


    protected static function bootHasUuid(){
        static::creating(function($model) {
           if(empty($model->uuid)){
            $model->uuid = (string) Str::uuid();
           }
        });
    }
}