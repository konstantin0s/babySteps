let globalVar = (function() {
    // global variables
    const signUpForm = document.getElementById('form');
    const passField = document.getElementById('pass').value;
    const userField = document.getElementById('user');
    const okButton = document.getElementById('submit');
    let fields = document.querySelectorAll('input');
    let help = document.querySelector('#help');

    return {
        signUpForm: signUpForm,
        passField: passField,
        userField: userField,
        okButton: okButton,
        fields: fields,
        help: help
    };
}());


function inputCheck() {

    for (let field of Array.from(globalVar.fields)) {

        field.addEventListener('keyup', (event) => {
            if ((globalVar.signUpForm.checkValidity())) {
                if ((field.value.length >= 3)) {
                    globalVar.okButton.disabled = false;
                } else {
                    globalVar.okButton.disabled = true;
                }
            } else {
                globalVar.okButton.disabled = true;
            }
        });
    }
}

inputCheck();

function validName() {
    var nameRegex = /^(?!-)(?!.*-$)[a-zA-Z-]+$/;
    if (globalVar.userField.value.match(nameRegex) === null || globalVar.userField.value.length < 3) {
        let text = event.target.getAttribute('data-help');
        globalVar.help.textContent = text;
        globalVar.okButton.disabled = true;
    } else {
        globalVar.help.textContent = "";
        globalVar.okButton.disabled = false;
    }
}


document.getElementById('user').addEventListener('keyup', () => {
    validName();
});