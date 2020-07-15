//implement search
let inputSearch = document.getElementById('input');
if (inputSearch) {
    inputSearch.addEventListener('keyup', () => {
        this.searchHandler();
    });

} else {

}


function searchHandler(event) {
    let filter, table, txtValue;
    filter = jsUcfirst(inputSearch.value);
    // console.log(filter)
    table = document.getElementById("table");
    let td = table.getElementsByTagName('td');

    for (let i = 0; i < td.length; i++) {
        let a = td[i].getElementsByTagName("a")[0];
        if (a) {
            txtValue = a.textContent || a.innerText;

            // console.log(txtValue);
            if (txtValue.indexOf(filter) > -1) {
                td[i].style.display = "";
            } else {
                td[i].style.display = "none";
            }
        }
    }
}

jsUcfirst = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


$(document).ready(function() {
    //search 
    $("#search-query").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "/search-result",
                type: "GET",
                data: request, // request is the value of search input
                success: function(data) {
                    // Map response values to fiedl label and value
                    response($.map(data, function(el) {
                        return {
                            label: el.title,
                            value: el._id
                        };
                    }));
                }
            });
        },

        // The minimum number of characters a user must type before a search is performed.
        minLength: 3,

        // set an onFocus event to show the result on input field when result is focused
        focus: function(event, ui) {
            this.value = ui.item.label;
            // Prevent other event from not being execute
            event.preventDefault();
        },
        select: function(event, ui) {
            // Prevent value from being put in the input:
            this.value = ui.item.label;
            // Set the id to the next input hidden field
            $(this).next("input").val(ui.item.value);
            // Prevent other event from not being execute
            event.preventDefault();
            // optionnal: submit the form after field has been filled up
            $('#quicksearch').submit();
        }
    });

});