const infoDevButton = document.getElementById('infouserButton');
const infoDev = document.getElementById('infouser')

infoDevButton.addEventListener('click', () => {

  infoDev.classList.toggle('--showInfo');

  setTimeout(() => {
    infoDev.classList.remove('--showInfo');
  }, 3000)

})
