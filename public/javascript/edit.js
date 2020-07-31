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

//validate password 
function validatePassword() {
    var firstPassword = document.form.password.value;
    var secondPassword = document.form.confirmPassword.value;
    // var strongRegex = new RegExp("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$");
    //Input Password and Submit [6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter]
    var passW = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (firstPassword.match(passW) || secondPassword.match(passW)) {

        //Minimum eight characters, at least one letter and one number:
        document.form.confirmPassword.classList.remove('alert-danger');
        document.form.password.classList.remove('alert-danger');
        return true;
    } else {
        document.form.confirmPassword.classList.add('alert-danger');
        document.form.password.classList.add('alert-danger');
        alert("Minimum six characters, at least one uppercase letter and one number!");
        return false;
    }
}

const passCheck = document.querySelector("#passCheck");
passCheck.addEventListener('blur', validatePassword);

//data help on input password
let help = document.getElementById('help');
let fields = document.querySelectorAll('input');
for (let field of Array.from(fields)) {
    field.addEventListener('focus', (event) => {
        let text = event.target.getAttribute('data-help');
        if (help.textContent === null) {}
        help.textContent = text;
    });
    field.addEventListener('blur', (event) => {
        help.textContent = '';
    });
}