// ./assets/js/components/Users.js

import React, {Component} from 'react';
import axios from 'axios';

class ExchangeRates extends Component {
    constructor() {
        super();
        this.state = { exchangeRates: [], selectedDate: '', currentRates: []};
        this.dates = [];

        this.todayDate = new Date();

        let params = new URLSearchParams(document.location.search);
        if (params.has('date')) {
            this.state.selectedDate = params.get('date');
        }
        
        for(var dt=new Date('2023-01-01'); dt<=new Date(); dt.setDate(dt.getDate()+1)){
            this.dates.push(new Date(dt));
        }
        this.dates = this.dates.reverse();        
    }

    getBaseUrl() {
        return 'http://localhost';
    }

    componentDidMount() {
        this.getExchangeRates();
    }

    getExchangeRates(date = null) {
        const baseUrl = this.getBaseUrl();

        if (date == null) {
            date = new Date().toISOString().slice(0, 10);
        }
        
        axios.get(baseUrl + `/api/exchange-rates/${date}`).then(response => {
            this.setState({ exchangeRates: response.data.data})
        }).catch(function (error) {
            console.error(error);
        });

        if (this.state.selectedDate) {
            this.getExchangeRatesForSelectedDate(this.state.selectedDate)
        }
        
    }
    
    getExchangeRatesForSelectedDate(date) {
        let results = null;
        let data = {};

        axios.get(this.getBaseUrl() + `/api/exchange-rates/${date}`).then(response => {
            results = response.data.data;
            for (const [key, value] of Object.entries(results)) {                    
                data[value.code] = {'buy': value.buy, 'sell': value.sell};
            }

            this.setState({ currentRates: data })
        }).catch(function (error) {
            console.error(error);
        });
    }

    setQueryParams(date) {
        let params = new URLSearchParams(document.location.search);
        params.set('date', date);

        const path = window.location.href.split('?')[0];
        const newURL = `${path}?${params}`;

        history.pushState({}, '', newURL);
    }

    handleChange = event => {
        const date = event.target.value;
        this.setState({selectedDate: event.target.value});
        this.setQueryParams(date)

        this.getExchangeRatesForSelectedDate(date)
    }

    dateFormat(date) {
        return date.toLocaleDateString("pl-PL", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
    }

    currencyFormat(value) {
        return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value);
    }

    render() {
        return(
            <section className='mt-5'>
                <div className='container'>
                    <div className="row">
                        <div className="col bg-white">

                            <div className='d-flex align-items-center  my-4'>
                                <p className='mb-0 mr-2'>Kurs z dnia:</p>
                                <select value={ this.state.selectedDate } onChange={ this.handleChange }>
                                    {this.dates.map((date, index) => {
                                        return (
                                            <option key={index} value={date.toISOString().slice(0, 10)}>{ this.dateFormat(date) }</option>
                                        );
                                    })}
                                </select>
                            </div>
                            
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Kod waluty</th>
                                        <th scope="col">Nazwa waluty</th>
                                        <th scope="col">Kurs dzisiejszy ({ this.dateFormat(this.todayDate) })</th>
                                        <th scope="col">Kurs archiwalny ({ this.dateFormat(new Date(this.state.selectedDate)) })</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.exchangeRates.map((exchangeRate, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{++index}</th>
                                                <td>{exchangeRate.code}</td>
                                                <td>{exchangeRate.currency}</td>
                                                <td>
                                                    <p className='mb-0'>
                                                        Kupno: { exchangeRate.buy === 0 ? '---' : this.currencyFormat(exchangeRate.buy) }
                                                    </p>
                                                    <p className='mb-0'>
                                                        Sprzedaż: { this.currencyFormat(exchangeRate.sell) }
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className='mb-0'>
                                                        Kupno: { this.state.currentRates[exchangeRate.code] && this.state.currentRates[exchangeRate.code].buy !== 0 ? this.currencyFormat(this.state.currentRates[exchangeRate.code].buy) : '---' }
                                                    </p>
                                                    <p className='mb-0'>
                                                        Sprzedaż: { this.state.currentRates[exchangeRate.code] ? this.currencyFormat(this.state.currentRates[exchangeRate.code].sell) : '---' }
                                                    </p>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </section>
        )
    }
}
export default ExchangeRates;