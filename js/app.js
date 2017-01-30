(function() {
  'use strict';

  const movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  // ADD YOUR CODE HERE
  var submit = document.getElementsByClassName('btn-large')[0];

  submit.addEventListener("click", function(event) {
    // Prevents the default action
    event.preventDefault();
    var formData = document.getElementsByTagName('input')[0];
    var title = formData.value;
    // Validates if user input is blank
    if (title === "") {
      alert("Please enter a movie title.");
    }
    else {
      var url = `http://www.omdbapi.com/?s=${title}&y=&plot=full&r=json`;
      fetch (url)
        .then(function(pObj) {
          return pObj.json();
        })
        .then(function(json) {
          var arrayP = [];
          for (var i = 0; i < json.Search.length; i++) {
            var id = json.Search[i].imdbID;
            // AJAX request for each individual title by id
            var url2 = `http://www.omdbapi.com/?i=${id}&y=&plot=full&r=json`;
            arrayP.push(fetch (url2)
              .then(function(pObj2) {
                return pObj2.json();
              })
              .then (function(json2) {
                var tempObj = {};
                tempObj.plot = json2.Plot;
                tempObj.id = json2.imdbID;
                tempObj.poster = json2.Poster;
                tempObj.title = json2.Title;
                tempObj.year = json2.Year;
                return (tempObj);
              }));
          }
          // Waits for all Promises to resolve then executes
          Promise.all(arrayP)
            .then(function(array) {
              array.map(function(obj) {
                movies.push(obj);
              });
              renderMovies();
            });
        })
        .catch(function(error) {
          console.log(error);
          throw error;
        });
      // Resets the previous search and clears movies array
      formData.value = "";
      movies.splice(0, movies.length);
    }
  });

})();
