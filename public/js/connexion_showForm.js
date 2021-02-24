document.addEventListener('DOMContentLoaded', () => {

  const createAccountModale = document.getElementById('createAccountModale');
  const lostPassModale = document.getElementById('lostPassModale');
  const showCreateProfileButton = document.getElementById('showCreateProfile');
  const showLostPassButton = document.getElementById('showLostPass');
  const quitCreateProfil = document.getElementById('quitCreateProfil');
  const quitLostPass = document.getElementById('quitLostPass');


  /*------------------------------------------------------*/

  showCreateProfileButton.addEventListener('click', () => {

    createAccountModale.classList.toggle('--connexion__show');

  })

  showLostPassButton.addEventListener('click', () => {

    lostPassModale.classList.toggle('--connexion__show');

  })

  quitCreateProfil.addEventListener('click', () => {

    createAccountModale.classList.toggle('--connexion__show');

  })

  quitLostPass.addEventListener('click', () => {

    lostPassModale.classList.toggle('--connexion__show');

  })
})
