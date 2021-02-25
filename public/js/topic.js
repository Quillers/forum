const editBtns = document.getElementsByClassName('edit__btn');

if (editBtns.length) {

    for (const editBtn of editBtns) {
        editBtn.addEventListener('click', (e) => {
            const sections = e.currentTarget.parentElement.parentElement.querySelectorAll('section');
            sections[0].classList.toggle('message__main--hidden');
            sections[1].classList.toggle('message__main--hidden');
        });
    
    }

}