let bar = document.querySelector('#progress');

window.addEventListener('scroll', () => {
    let max = document.body.scrollHeight - innerHeight;
    bar.style.width = `${(pageYOffset / max) * 100}%`;
});