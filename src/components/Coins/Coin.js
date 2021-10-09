import React from 'react'
import FavouriteIcon from '../UI/FavouriteIcon'

const Coin = (props) => {

  const priceChangePercentage = props.priceChangePercent.toFixed(2)
  const priceColourClasses = priceChangePercentage < 0 ? 'bg-red-100 text-red-400' : 'bg-green-100 text-green-400'
  const coinWrapperClasses = props.isFavourite ? 'bg-yellow-50 border-yellow-500' : 'bg-white border-blue-200'

  return (
    <div className={`${coinWrapperClasses} p-4 flex flex-col border justify-between rounded-xl relative`}>
      <FavouriteIcon
        height="8"
        width="8"
        top="4"
        right="3"
        position="absolute"
        id={props.id}
        addFavouriteCoin={props.addFavouriteCoin}
        removeFavouriteCoin={props.removeFavouriteCoin}
        isFavourite={props.isFavourite}
      />
      <div className="mb-4 flex justify-start items-center space-x-3">
        <img src={props.image} alt={`${props.name} logo`} width="35px" />
        <h2 className="text-xl font-semibold pr-8">{props.name}</h2>
      </div>
      <div className="flex justify-between items-center space-x-2 text-sm">
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-500 rounded">{props.symbol.toUpperCase()}</span>
        <span>£{props.currentPrice.toLocaleString()}</span>
        <span className={priceColourClasses + " inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded"}>{priceChangePercentage}%</span>
      </div>
    </div>
  )
}

export default Coin