import React, { useState, useEffect, useCallback } from 'react'
import './App.css';
import CoinsList from './components/Coins/CoinsList'
import CurrencyForm from './components/Currency/CurrencyForm'
import CoinFilter from './components/Coins/CoinFilter';

function App() {

  const [coins, setCoins] = useState([])
  const [availableCurrencies, setAvailableCurrencies] = useState([])
  const [currency, setCurrency] = useState('gbp')
  const [search, setSearch] = useState('')
  const [showFavourites, setShowFavourites] = useState(false)
  // set the default "favouriteCoins" state from local storage if it exists other wise set as an empty array
  const [favouriteCoins, setFavouriteCoins] = useState(
    JSON.parse(localStorage.getItem('localFavouriteCoins')) ? JSON.parse(localStorage.getItem('localFavouriteCoins')) : []
  )

  const currencyChangeHandler = (event) => {
    event.preventDefault()
    setCurrency(event.target.value)
  }

  const searchChangeHandler = (event) => {
    event.preventDefault()
    setSearch(event.target.value)
  }

  const toggleFavouritesHandler = () => {
    setShowFavourites(prevShowFavourites => !prevShowFavourites)
  }

  const addFavouriteCoinHandler = (coin) => {
    setFavouriteCoins(prevFavouritesCoins => {
      return [...prevFavouritesCoins, coin]
    })
  }

  const removeFavouriteCoinHandler = (coinId) => {
    setFavouriteCoins(prevFavouritesCoins => {
      return prevFavouritesCoins.filter(coin => coin !== coinId)
    })
  }


  let filteredCoins = {}

  //filter coins by just search input
  filteredCoins = coins.filter((coin) => {
    return (
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
    )
  })

  //filter coins by search input and favourites
  if(showFavourites) {
    filteredCoins = coins.filter((coin) => {
      return (
        (
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase())
        ) && favouriteCoins.includes(coin.id)
      )
    })
  }

  // store favoutite coins in local storage anytime they change
  useEffect(() => {
    localStorage.setItem('localFavouriteCoins', JSON.stringify(favouriteCoins));
  }, [favouriteCoins]);

  // fetch available currencies from Coin Gecko API
  const fetchCurrencies = async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/supported_vs_currencies')
    const data = await response.json()
    setAvailableCurrencies(data)
  }

  useEffect(() => {
    fetchCurrencies();
  }, []);


  // fetch coin data from Coin Gecko API
  const fetchCoins = useCallback(async () => {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=250&page=1&sparkline=false`)
    const data = await response.json()
    setCoins(data)
  }, [currency])

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins, currency]);

  const favouriteButtonClasses = showFavourites ? 'text-yellow-400' : 'text-blue-100'

  return (
    <div className="App container mx-auto px-4">

      <header className="my-4 flex flex-col justify-between md:flex-row md:space-x-4">

        <div className="flex flex-col justify-between items-left">
          <h1 className="text-3xl font-bold mb-2">Crypto Tracker</h1>
          <p>By Ste Royle | <a href="https://github.com/steroyle/crypto-tracker-react-app">View on GitHub</a></p>
        </div>

        <div className="flex justify-between md:justify-end items-center md:space-x-4">

          <CoinFilter
            search={search}
            onSearchChange={searchChangeHandler}
          />

          <button
            className={`${favouriteButtonClasses} rounded`}
            onClick={toggleFavouritesHandler}
          >
            <svg
              className={`h-11 w-11 cursor-pointer select-none`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>

          <CurrencyForm currencies={availableCurrencies} currency={currency} onCurrencyChange={currencyChangeHandler} />


        </div>

      </header>
      {
        coins.length !== 0 &&
        <CoinsList
          coins={filteredCoins}
          currency={currency}
          addFavouriteCoin={addFavouriteCoinHandler}
          removeFavouriteCoin={removeFavouriteCoinHandler}
          favouriteCoins={favouriteCoins}
        />
      }
    </div>
  );
}

export default App;