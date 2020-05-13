
function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}

//Promesas
const getUser = new Promise(function(todoBien, todoMal)
{
  setTimeout(function(){
    //luego de 3 segundos
    todoMal('se acabo el tiempo');
  }, 3000)
})

getUser
.then(function(message){
  console.log('todo esta bien en la vida')
})
.catch(function(message){
  console.log(message)
})

//Peticiones en ajax- XMLTttpRequest
$.ajax('https://randomuser.me/api/',{
  method:'GET',
  success: function(data){
    console.log(data)
  },
  error: function(erro){
    console.log(error)
  }
})


 //Metodo fetch : mas abreviado que una peticion ajax
fetch('https://randomuser.me/api/')
  .then(function(response){
    //console.log(response)
    return response.json()
  })
  .then(function(user){
    console.log('user', user.results[0].name.first)
  })
  .catch(function(){
    console.log('algo fallo')
  });


  (async function load(){
    //await

    //funcion asincrona
   async function getData(url){

    const response = await fetch(url);
    const data = await response.json();
    if(data.data.movie_count > 0){
      return data;
    }

    throw new Error('No se encontro ningun resultado');
   } 
   
   //Promesas con fetch --- el await solo funciona como funciones asincronas
   const $form = document.getElementById('form');
   const $home = document.getElementById('home');
   const $featuringContainer = document.getElementById('featuring');
   

   function setAttributes($element, attributes){
     for(const attribute in attributes){
       $element.setAttribute(attribute, attributes[attribute]);
       $featuringContainer.append()
     }

   }

   const BASE_API = 'https://yts.mx/api/v2/';

   function featuringTemplate(peli){
     return (
      `<div class="featuring">
      <div class="featuring-image">
        <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
      </div>
      <div class="featuring-content">
        <p class="featuring-title">Pelicula encontrada</p>
        <p class="featuring-album">${peli.title}</p>
      </div>
    </div>`
     )
   }
   
   $form.addEventListener('submit', async (event) => {
      event.preventDefault();
      $home.classList.add('search-active')
      const $loader = document.createElement('img');
      setAttributes($loader,{
        src: 'src/images/loader.gif',
        height: 50,
        width: 50,
      })
      $featuringContainer.append($loader);


      const data = new FormData($form);
      try{
        const {
                data:{
                  movies: pelis
                }
              } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')} `);  
               const HTMLString = featuringTemplate(pelis[0]);
              $featuringContainer.innerHTML = HTMLString;

      }catch(error){
          alert(error.message);
          $loader.remove();
          $home.classList.remove('search-active');
      }
      
   })

  
   function videoItemTemplate(movie, category) {
    return (
      `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category=${category}>
        <div class="primaryPlaylistItem-image">
        
          <img src="${movie.medium_cover_image}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>`
    )
  }

  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }
  function addEventClick($element) {
    $element.addEventListener('click', () => {
      // alert('click')
      showModal($element)
    })
  }
  function renderMovieList(list, $container, category) {
    // actionList.data.movies
    $container.children[0].remove();
    list.forEach((movie) => {
      const HTMLString = videoItemTemplate(movie, category);
      const movieElement = createTemplate(HTMLString);
      $container.append(movieElement);
      const image = movieElement.querySelector('img');
      image.addEventListener('load', () => {
        event.srcElement.classList.add('fadeIn');
      })
      addEventClick(movieElement);
    })
  }

  
  const {data: { movies: actionList} } = await getData(`${BASE_API}list_movies.json?genre=action`)
  const $actionContainer = document.querySelector('#action');
  renderMovieList(actionList, $actionContainer, 'action');

  const {data: { movies: dramaList} } = await getData(`${BASE_API}list_movies.json?genre=drama`)
  const $dramaContainer = document.getElementById('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');

  const {data: { movies: animationList} } = await getData(`${BASE_API}list_movies.json?genre=animation`)
  const $animationContainer = document.getElementById('animation');
  renderMovieList(animationList, $animationContainer, 'animation');

  // const $home = $('.home .list #item');
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');

  function findById(list, id) {
    return list.find(movie => movie.id === parseInt(id, 10))
  }

  function findMovie(id, category) {
    switch (category) {
      case 'action' : {
        return findById(actionList, id)
      }
      case 'drama' : {
        return findById(dramaList, id)
      }
      default: {
        return findById(animationList, id)
      }
    }
  }

  function showModal($element) {
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards';
    const id = $element.dataset.id;
    const category = $element.dataset.category;
    const data = findMovie(id, category);

    $modalTitle.textContent = data.title;
    $modalImage.setAttribute('src', data.medium_cover_image);
    $modalDescription.textContent = data.description_full
  }

  $hideModal.addEventListener('click', hideModal);
  function hideModal() {
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut .8s forwards';

  }

  const $myPlaylistContainer = document.querySelector('#myPlaylist');

function itemTemplate(movie, category) {
    return (
      `<li class="myPlaylist-item" data-id="${movie.id}" data-category="${category}">
      <a href="#">
        <span>
        ${movie.title}
        </span>
      </a>
    </li>`
    )
  }

function renderFavoriteList(list, $container, category) {
    $container.children[0].remove();
    list.forEach(movie => {
      const HTMLString = itemTemplate(movie, category);
      $container.innerHTML += HTMLString;
    })
    movieClick($container);
  }

const { data: { movies: scifiList } } = await getData(`${BASE_API}list_movies.json?genre=sci-fi&limit=10`)
renderFavoriteList(scifiList, $myPlaylistContainer, 'scifi');

  })()









  