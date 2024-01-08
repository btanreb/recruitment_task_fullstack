<?php

namespace App\Controller;

use Nbp;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ApiController extends AbstractController
{
    private $client;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
    }

    /**
     * @Route("/api/exchange-rates/{date}", name="app_api")
     */
    public function index($date): Response
    {
        $nbp = new Nbp($this->client);
        $result = $nbp->getExchangeRates($date);

        return $this->json([
            'data' => $result,
        ]);
    }
}
