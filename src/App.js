import React, { useReducer, useRef } from 'react';

import { useFetch, useInfiniteScroll, useLazyLoading } from './customHooks'
import './index.css';
import './style.css';

function App() {
  const imgReducer = (state, action) => {
    switch (action.type) {
      case 'STACK_IMAGES':
        return { ...state, images: state.images.concat(action.images) }
      case 'FETCHING_IMAGES':
        return { ...state, fetching: action.fetching }
      default:
        return state;
    }
  }

  const pageReducer = (state, action) => {
    switch (action.type) {
      case 'ADVANCE_PAGE':
        return { ...state, page: state.page + 1 }
      default:
        return state;
    }
  }

  const [pager, pagerDispatch] = useReducer(pageReducer, { page: 1 })
  const [imgData, imgDispatch] = useReducer(imgReducer, { images: [], fetching: true, })

  let bottomBoundaryRef = useRef(null);
  useFetch(pager, imgDispatch);
  useLazyLoading('.card-img-top', imgData.images)
  useInfiniteScroll(bottomBoundaryRef, pagerDispatch);


  var allMovies = []
  if (imgData.images.length > 0) {
    imgData.images.map((image) => {
      image.results.forEach(movie => {
        allMovies.push(
          <div key={movie.id}>
            <div class="grid" style={{
              borderRadius: '0.5em',
              margin: '0.5em'
            }}>
              <figure class="effect-zoe">
                <img
                  src="https://i.imgur.com/FEDTpyE.gif"
                  alt="images"
                  data-src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                  className="card-img-top"
                />
                <figcaption
                  style={{
                    padding: '0.5em'
                  }}
                >
                  <h4>{movie.title}</h4>
                  <p class="icon-links">
                    <i class="material-icons">thumb_up_alt</i>
                  </p>
                  <p class="description">
                    {movie.overview.slice(0, 100)}...
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        )
      });
      return null
    })
  }

  return (
    <div className="">
      <nav className="navbar bg-light">
        <div className="container">
          <a className="navbar-brand" href="/#">
            <h2>The Movie DB</h2>
          </a>
        </div>
      </nav>

      <div id='images' className="container">
        <div className="row">
          {allMovies}
        </div>
      </div>

      {imgData.fetching && (
        <div className="text-center bg-secondary m-auto p-3">
          <p className="m-0 text-white">Getting Movies</p>
        </div>
      )}
      <div id='page-bottom-boundary' style={{ border: '1px solid red' }} ref={bottomBoundaryRef}></div>
    </div>
  );
}

export default App;
