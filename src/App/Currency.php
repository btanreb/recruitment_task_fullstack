<?php

namespace App;

class Currency
{
    public $allowedCurrencies = ['EUR', 'USD', 'CZK', 'IDR', 'BRL'];
    
    public $currencySettings = [
        'EUR' => [
            'buy' => 0.05,
            'sell' => 0.07
        ],
        'USD' => [
            'buy' => 0.05,
            'sell' => 0.07
        ],
        'CZK' => [
            'buy' => null,
            'sell' => 0.15
        ],
        'IDR' => [
            'buy' => null,
            'sell' => 0.15
        ],
        'BRL' => [
            'buy' => null,
            'sell' => 0.15
        ],
    ];
}
