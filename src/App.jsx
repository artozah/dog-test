import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [mainDog, setMainDog] = useState({ image: '', breed: '' })
  const [dogThumbnails, setDogThumbnails] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMainDog = async () => {
      try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random')
        const data = await response.json()
        const breed = data.message.split('/')[4]
        setMainDog({ image: data.message, breed })
      } catch (error) {
        console.error('Error fetching main dog:', error)
      }
    }

    const fetchDogThumbnails = async () => {
      try {
        const response = await fetch('https://dog.ceo/api/breed/hound/images/random/10')
        const data = await response.json()
        const thumbnails = data.message.map((url, index) => ({
          id: index,
          image: url,
          breed: url.split('/')[4]
        }))
        setDogThumbnails(thumbnails)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dog thumbnails:', error)
        setLoading(false)
      }
    }

    fetchMainDog()
    fetchDogThumbnails()
  }, [])

  const handleThumbnailClick = (thumbnail) => {
    setMainDog({ image: thumbnail.image, breed: thumbnail.breed })
  }

  const addToFavorites = () => {
    const isAlreadyFavorite = favorites.some(fav => fav.image === mainDog.image)

    if (!isAlreadyFavorite) {
      setFavorites([...favorites, { id: Date.now(), image: mainDog.image, breed: mainDog.breed }])
    }
  }

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id))
  }

  const selectFavorite = (favorite) => {
    setMainDog({ image: favorite.image, breed: favorite.breed })
  }

  if (loading) {
    return <div className="App">Loading dogs...</div>
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Random Dog Gallery</h1>

        <div className="app-container">
          <div className="main-content">
            <div className="main-dog">
              <img src={mainDog.image} alt={mainDog.breed} className="main-image" />
              <p className="breed-label">Breed: {mainDog.breed}</p>
              <button className="favorite-button" onClick={addToFavorites}>
                Add to Favorites
              </button>
            </div>

            <div className="thumbnails">
              {dogThumbnails.map((thumbnail) => (
                <div
                  key={thumbnail.id}
                  className="thumbnail-container"
                  onClick={() => handleThumbnailClick(thumbnail)}
                >
                  <img
                    src={thumbnail.image}
                    alt={thumbnail.breed}
                    className="thumbnail"
                  />
                  <p className="thumbnail-breed">{thumbnail.breed}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="favorites-panel">
            <h2>Favorites</h2>
            {favorites.length === 0 ? (
              <p className="no-favorites">No favorites yet</p>
            ) : (
              <div className="favorites-list">
                {favorites.map((favorite) => (
                  <div key={favorite.id} className="favorite-item">
                    <img
                      src={favorite.image}
                      alt={favorite.breed}
                      className="favorite-thumbnail"
                      onClick={() => selectFavorite(favorite)}
                    />
                    <div className="favorite-info">
                      <p className="favorite-breed">{favorite.breed}</p>
                      <button
                        className="remove-button"
                        onClick={() => removeFromFavorites(favorite.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}

export default App