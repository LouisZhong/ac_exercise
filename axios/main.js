let button = document.querySelector('button')
let show = document.querySelector('#show')

button.addEventListener('click', function(){
  axios.get('https://webdev.alphacamp.io/api/lyrics/Coldplay/Yellow.json')
    .then(function (response) {
      // handle success
      show.innerHTML = response.data.lyrics
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })

})


