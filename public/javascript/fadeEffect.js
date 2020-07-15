//load with fadein on page
function fadeEffect() {
    let fadein = document.getElementById('fadein');
    if (!fadein.classList.contains('loaderx')) {
        fadein.classList.add('loaderx');
    }

}

window.addEventListener('load', fadeEffect);