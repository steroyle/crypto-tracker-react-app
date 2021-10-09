import React from 'react'
import Coin from './Coin'

const CoinsList = (props) => {
  return (
    <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {props.coins.map((coin) => {
        return (
          <Coin
            key={coin.id}
            id={coin.id}
            name={coin.name}
            symbol={coin.symbol}
            image={coin.image}
            currentPrice={coin.current_price}
            priceChangePercent={coin.price_change_percentage_24h}
            currency={props.currency}
            addFavouriteCoin={props.addFavouriteCoin}
            removeFavouriteCoin={props.removeFavouriteCoin}
            isFavourite={props.favouriteCoins.includes(coin.id) ? true : false }
          />)
      })}
    </div>
  )
}

export default CoinsList