
  //load with fadein on page
  window.onload = function() {
    document.body.classList.add('loaderx');
  }



//implement search
var inputSearch = document.getElementById('input')
  inputSearch.addEventListener('keyup', () => {
    this.searchHandler();
  });
  


function searchHandler(event) {
  var filter, table, txtValue;
  filter = jsUcfirst(inputSearch.value);
  // console.log(filter)
  table = document.getElementById("table");
 var td = table.getElementsByTagName('td');

 for (var i = 0; i < td.length; i++) {
  var a = td[i].getElementsByTagName("a")[0];
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



// Responsive Nav
(function ($) {
  menu = $('nav ul');

  $('#openup').on('click', function (e) {
    e.preventDefault();
    menu.slideToggle();
  });

  $(window).resize(function () {
    var w = $(this).width();
    if (w > 480 && menu.is(':hidden')) {
      menu.removeAttr('style');
    }
  });

  $('nav li').on('click', function (e) {
    var w = $(window).width();
    if (w < 480) {
      menu.slideToggle();
    }
  });
  $('.open-menu').height($(window).height());
})(jQuery);

// Smooth Scrolling
$('.cf a').on('click', function (event) {
  if (this.hash !== '') {
    event.preventDefault();

    const hash = this.hash;

    $('html, body').animate(
      {
        scrollTop: $(hash).offset().top
      },
      800,
      function () {
        window.location.hash = hash;
      }
    );
  }
});



$(document).ready(function () {
  $('.delete-recipe').on('click', function (e) {
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/recipe/' + id,
      success: function (response) {
        alert('Deleting recipe');
        window.location.href = '/';
      },
      error: function (err) {
        console.log(err);
      }
    });
  });


  $("#search-query").autocomplete({
    source: function (request, response) {
      $.ajax({
        url: "/search-result",
        type: "GET",
        data: request,  // request is the value of search input
        success: function (data) {
          // Map response values to fiedl label and value
          response($.map(data, function (el) {
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
    focus: function (event, ui) {
      this.value = ui.item.label;
      // Prevent other event from not being execute
      event.preventDefault();
    },
    select: function (event, ui) {
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
