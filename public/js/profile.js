const profile = {

  showButtons: document.querySelectorAll('.profile__formContainer__titleRow'),
  closeButtons: document.querySelectorAll('.profile__form__close'),

  addEventListener: function() {

    for (const button of profile.showButtons) {
      button.addEventListener('click', profile.showForm)
    };
    for (const button of profile.closeButtons) {
      button.addEventListener('click', profile.hideForm)
    }
  },

  showForm: function(event) {

    const form = event.target;
    form.closest('.profile__formContainer').classList.toggle('--showProfileForm');

  },

  hideForm: function(event) {

    const form = event.target;
    form.closest('.profile__formContainer').classList.remove('--showProfileForm');

  },
}

document.addEventListener('DOMContentLoaded', profile.addEventListener)
