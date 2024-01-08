<?php

use App\Currency;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class Nbp
{
    private $client;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
    }

    public function getExchangeRates($date): array
    {
        if ($date == date('Y-m-d')) {
            $url = 'https://api.nbp.pl/api/exchangerates/tables/A?format=json';
        } else {
            $url = 'https://api.nbp.pl/api/exchangerates/tables/A/'. $date .'?format=json';
        }

        $response = $this->client->request('GET', $url);

        try {
            $data = $response->toArray();
        } catch (Exception $e) {
            return [];
        }       

        $currency = new Currency();
        $result = [];

        foreach ($data[0]['rates'] as $currencyRate)
        {
            if (!in_array($currencyRate['code'], $currency->allowedCurrencies)) {
                continue;
            }
            
            $currencyRate['buy'] = $this->roundValue($currencyRate['mid'] - $currency->currencySettings[$currencyRate['code']]['buy']);
            $currencyRate['sell'] = $this->roundValue($currencyRate['mid'] + $currency->currencySettings[$currencyRate['code']]['sell']);

            $result[] = $currencyRate;
        }

        return $result;
    }

    public function roundValue($value)
    {
        return round($value, 2);
    }
}
