//check image extension
function checkExtension() {
    let file = document.querySelector("#addPic");
    let message = document.querySelector('.message');
    let text = 'Image uploaded successfully!';

    if (/\.(jpe?g|png|gif)$/i.test(file.files[0].name) === false) {
        alert("Please select an jpg, png, jpeg type!");
    } else {
        message.innerHTML = text;
    }
}

let addPic = document.getElementById('addPic');
addPic.addEventListener('change', checkExtension);

//hide show password container
let flip = document.querySelector('.flip');
flip.addEventListener('click', display);

function display() {
    document.getElementById("pass").style.display = "block";
}