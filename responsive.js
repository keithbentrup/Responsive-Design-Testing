var defaultURL = 'http://esi-dev-cert.gsiccorp.net:1080/gsi/webstore/WFS/TSS-TSSD1-Site/en_US/-/USD/Default-Start'; //<---- CHANGE TO YOUR WEBSITE URL

/* //show loading graphic
function showLoader(id) {
  $('#' + id + ' img').fadeIn('slow');
}

//hdie loading graphic
function hideLoader(id) {
  $('#' + id + ' img').fadeOut('slow');
} */

//function to check load state of each frame
function allLoaded(){
  var results = [];
  $('iframe').each(function(){
    if(!$(this).data('loaded')){results.push(false)}
  });
  var result = (results.length > 0) ? false : true;
  return result;
};

function loadPage($frame, url) {
  if ( url.substr(0,7) !== 'http://' && url.substr(0,8) !== 'https://' && url.substr(0, 7) !== 'file://' ) {
    url = 'http://'+url;
  }
  //$('iframe').not($frame).each(function(){showLoader($(this).parent().attr('id'));})
  // is this to prevent recursive loading?
  $('iframe').not($frame).data('loaded', false);
  $('iframe').not($frame).attr('src', url);
}

//$('.frame').each(function(){showLoader($(this).attr('id'))});


//when document loads
$(document).ready(function(){

  loadPage('', defaultURL);

  //query string
  var qsArray = window.location.href.split('?');
  var qs = qsArray[qsArray.length-1];

  if(qs != '' && qsArray.length > 1){
    $('#url input[type=text]').val(qs);
    loadPage('', qs);
  }

  //set slidable div width
  $('#frames #inner').css('width', function(){
    var width = 0;
    $('.frame').each(function(){width += $(this).outerWidth() + 20});
    return width;
  });

  //add event handlers for options radio buttons
  $('input[type=radio]').change(function(){
    $frames = $('#frames');
    $inputs = $('input[type=radio]:checked').val();

    if($inputs == '1'){
      $frames.addClass('widthOnly');
    } else {
      $frames.removeClass('widthOnly');
    }
  });

  //add event handlers for scrollbars checkbox
  $('input[type=checkbox]').change(function(){
    var scrollBarWidth = 15;
    $frames = $('#frames');
    $inputs = $('#scrollbar:checked');

    if( $inputs.length == 0 ){
      scrollBarWidth = -15;
    }

    $frames.find('iframe').each(function(i,el) {
      $(el).attr('width', parseInt($(el).attr('width')) + scrollBarWidth);
    });
  });

  //when the url textbox is used
  $('form').submit(function(){
    loadPage('' , $('#url input[type=text]').val());
    return false;
  });

  //when frame loads
  $('iframe').load(function(){

    var $this = $(this);
    var url = '';
    var error = false;
    var iframeWin = $this[0].contentWindow;
    /*$(iframeWin).on('unload', function () {
      //console.log(this.document.URL);

      // remove all unload events that were attached on load
      $('iframe').each(function () {
        $($(this)[0].contentWindow).off('unload', myNotYetDefinedFunction);
      });
      
      // watch for the actual change
      var watcher = setInterval(function () {
        if (iframeWin.document.URL != oldURL) {
          clearInterval(watcher)
          //set the src or load the other frames
        }
      }, 10);
    }); */

    try{
      url = $this.contents().get(0).location.href;
    } catch(e) {
      error = true;
      if($('#url input[type=text]').val() != ''){
        url = $('#url input[type=text]').val();
      } else {
        url = defaultURL;
      }
    }

    //load other pages with the same URL
    if(allLoaded()){
      if(error){
        alert('Browsers prevent navigation from inside iframes across domains.\nPlease use the textbox at the top for external sites.');
        loadPage('', defaultURL);
      }else{
        loadPage($this, url);
      }
    } else{ //when frame loads, hide loader graphic
      error = false;
      //hideLoader($(this).parent().attr('id'));
      $(this).data('loaded',true);
    }
  });

});