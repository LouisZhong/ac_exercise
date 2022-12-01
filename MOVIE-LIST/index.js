const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

// 拿來存電影陣列
const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function renderMovieList(data) {
  let rawHTML = ''

  // processing
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card" style="width: 18rem;">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie " data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1;page <= numberOfPages; page ++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// 給page -> 該顯示哪幾部電影
function getMoviesByPage(page) {
  // 應該有兩種分頁模式:1.完整 2.搜尋

  //如果搜尋電影的長度是有東西(TRUE)，則給:左邊，如果是空陣列，則把movies給我(:右邊)
  const data = filteredMovies.length ? filteredMovies : movies

  // page 1 -> movies 0 - 11
  // page 2 -> movies 12 - 23
  // page 3 -> movies 24 - 35 ...
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="" class="movie-poster" class="img-fluid">`
  })
}

function addToFavorite(id) {
  // 這是下方簡潔寫法的內容
  // function isMovieIdMatched(movie) {
  //   // 前面的id跟後面的id不一樣，一個是物件的id一個是參數的id
  //   return movie.id === id
  // }
  
  // or寫法是，左右哪邊為true就回傳哪邊，都是true優先左邊，localstorage只能儲存字串，所以要透過JSON parse函數轉成JS物件資料格式
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)
  
  //some函數會檢查陣列資料是否符合條件，有就回true
  if (list.some(movie => movie.id === id)) {
    return alert('此電影已經在收藏清單中!')
  }

  list.push(movie)
  console.log(list)
  //把資料JSON字串化，才能存在local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    // dataset裡面的值是字串
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event){
  //如果點擊的目標不是<a></a>則返回
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

searchForm.addEventListener('submit', function onSearchForm(event) {
  event.preventDefault()
  // trim是為了去除前後空白
  const keyword = searchInput.value.trim().toLowerCase()
  // console.log(searchInput.value)
  

  // length如果是0就會是false，加驚嘆號變成true，意即空白內容的搜尋會警示
  // if (!keyword.length) {
  //   return alert('Please enter valid string')
  // }

  //其他常見的陣列操作函式: map, filter, reduce
  filteredMovies = movies.filter((movie) => 
    movie.title.toLowerCase().includes(keyword)
  )
  // 使用迴圈的作法
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)){
  //     filteredMovies.push(movie)
  //   }
  // }

  if (filteredMovies.length === 0) {
    return alert('Cannot find movies with keyword:  ' + keyword)
  }
  
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})

axios.get(INDEX_URL).then((response) => {
  // Array(80)
  // console.log(response.data.results)
  // 原本的80筆物件資料，最外層有陣列包著，所以先分別取出物件再存入movies，避免兩層陣列
  // 方法一：for迴圈
  // for (const movie of response.data.results){
  //   movies.push(movie)
  // }
  // 方法二：展開運算子
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMoviesByPage(1))
})

// localStorage.setItem('default_language', 'english')
// console.log(localStorage.getItem('default_language', 'english'))
// console.log()