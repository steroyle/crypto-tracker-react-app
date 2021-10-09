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

  return (
    <div className="App container mx-auto px-4">
      <header className="my-4 flex justify-start items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Crypto Tracker</h1>
          <p>By Ste Royle | <a href="https://github.com/steroyle/crypto-tracker-react-app">View on GitHub</a></p>
        </div>
        <div className="flex flex-1 justify-end items-center space-x-4">
          <CoinFilter
            search={search}
            onSearchChange={searchChangeHandler}
          />
          <button
            className="bg-white border border-yellow-400 hover:bg-yellow-400 text-yellow-500 hover:text-white font-semibold py-2 px-4 rounded"
            onClick={toggleFavouritesHandler}
          >
            {!showFavourites ? 'Show Favourites' : 'Show All'}
          </button>
          <CurrencyForm currencies={availableCurrencies} currency={currency} onCurrencyChange={currencyChangeHandler} />
        </div>
      </header>
      {
        coins.length !== 0 &&
        <CoinsList
          coins={filteredCoins}
          addFavouriteCoin={addFavouriteCoinHandler}
          removeFavouriteCoin={removeFavouriteCoinHandler}
          favouriteCoins={favouriteCoins}
        />
      }
    </div>
  );
}

export default App;