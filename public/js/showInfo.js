document.addEventListener('DOMContentLoaded', () => {

  const infouserButton = document.getElementById('infouserButton');
  const infouser = document.getElementById('infouser')
  let shown = 0;

  /**
   * Affiche les infos destinées à l'utilisateur
   */
  const showInfo = () => {

    if (shown) { clearTimeout(shown) };

    infouser.classList.toggle('--showInfo');

    shown = setTimeout(() => {
      if (infouser.classList.contains('--showInfo')) {

        infouser.classList.remove('--showInfo');
      }
    }, 3000)
  }


  if (document.getElementById('infoMessage') !== null) showInfo();

  infouserButton.addEventListener('click', showInfo);


});
