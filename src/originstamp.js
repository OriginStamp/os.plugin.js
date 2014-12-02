/*
 *
 * OriginStamp v0.0.1
 * http://www.originstamp.org 
 *
 * Copyright (c) 2014, André Gernandt
 *  
 * Licensed under MIT (https://github.com/OriginStamp/os.plugin.js/blob/master/LICENSE)
 *
 */

(function(os){

  var overlay = null;
  const API_URL = 'http://originstamp.org/api/stamps';
  // const API_URL = 'http://localhost:3000/api/stamps';
  os.selector = ".originstamp";
  os.api_key = "";

  function init_progress_overlay() {
    overlay = document.getElementById( "originstamp" );
    if ( overlay == null ) {
      overlay = document.createElement( "div" )
      overlay.id = "originstamp";
      overlay.style.position = "absolute";
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.zIndex = 10000;
      overlay.style.background = "rgba(0,0,0,0.3)";
      overlay.style.display = "block";
      document.body.appendChild( overlay )
    }
    overlay.hide = function() {
      this.style.display = "none";
    }

    overlay.show = function() {
      this.style.display = "block";
    }
    return overlay;
  }

  function write_request_status_to_frontend(xhr) {
    if ( xhr.status == 200 ) {
      document.querySelector( ".alert-success" ).innerText = "Your stamp was successfully added";
      document.querySelector( ".alert-danger" ).innerText = "";
    } else {
      document.querySelector( ".alert-success" ).innerText = "";
      document.querySelector( ".alert-danger" ).innerText = "Something went wrong.";
    }
  }

  function loadJS(path) {
    var js = document.createElement("script");

    js.type = "text/javascript";
    js.src = path
    document.body.appendChild(js);
  }

  function merge_objects(a, b) {
    for (var attrname in b) {
      a[attrname] = b[attrname];
    }
    return a;
  }


  // Public functions
  os.success = function(element, xhr) {
    // write_request_status_to_frontend(xhr);

    // @TODO
    // overlay.hide();

    // Uncomment this line to submit the "real" form-action after OriginStamp creation
    element.submit();
  }

  os.error = function(element, xhr, errors) {
    console.log(errors);
  }

  os.compute_hash = function(string) {
    var sha256 = CryptoJS.algo.SHA256.create();
    sha256.update(CryptoJS.enc.Latin1.parse(string));
    return sha256.finalize() + ""
  }

  os.init = function(overrides){

    os = merge_objects(os, overrides);

    loadJS("http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/sha256.js")
    // loadJS("http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js")

    elements = document.querySelectorAll( os.selector )
    // In case there are multiple forms on the same webpage
    for (var i = elements.length - 1; i >= 0; i--) {
      element = elements.item( i );
      element.onsubmit = function( e ) {

        // @TODO check if exists
        // Show a overlay n the website, to make the user unstand that the originstamp is processing in background.
        // var overlay = init_progress_overlay();
        // overlay.show();

        e.preventDefault();

        // Init the HTTP request to OriginStamp API
        var xhr = new XMLHttpRequest();
        xhr.open( "POST", API_URL );
        xhr.setRequestHeader( "Authorization", "Token token=" + os.api_key );
        xhr.withCredentials = true;
        // Set the success/error handlers for the HTTP request
        xhr.onreadystatechange = function() {
          if ( xhr.readyState == 4 ) {
            response = JSON.parse( xhr.responseText );
            if ( typeof response.errors != 'undefined' ) {
              os.error(e.srcElement, xhr, response.errors)
            } else {
              os.success(e.srcElement, xhr)
            }
          }
        }


        // @TODO in case there is a need for a progress bar
        // Listen to the upload progress.
        // var progressBar = $( '#originstamp .progress' );
        // xhr.upload.onprogress = function( e ) {
        //   if ( e.lengthComputable ) {
        //     progressBar.value = ( e.loaded / e.total ) * 100;
        //     progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
        //   }
        // }


        // Retrieve the form data, by selecting the form elements
        content = e.srcElement.querySelector( "[data-originstamp=\"content\"]" );
        contentString = "";
        sendResponseField = e.srcElement.querySelector( "[data-originstamp=\"send_back\"]" );
        senderField = e.srcElement.querySelector( "[data-originstamp=\"sender\"]" );
        titleField = e.srcElement.querySelector( "[data-originstamp=\"title\"]" );

        sendResponse = false;
        if (sendResponseField != null) {
          sendResponse = sendResponseField.checked;
        }

        // Default JSON post object for the HTTP request
        jsonPOST = {
          sender : (senderField) ? senderField.value : null,
          title : (titleField) ? titleField.value : null
          // Not yet implemented server-side
          // recipients : e.srcElement.querySelector( "[data-originstamp=\"recipients\"]" ).value
        }

        // Check if either a file or a plain text will be submitted to the OriginStamp API
        if ( content.type == "file" ) {
          if ( window.File && window.FileReader && window.FileList && window.Blob ) {
            file = content.files.item( 0 )
            if ( file != null ) {
              var reader = new FileReader();
              reader.readAsBinaryString( file )
              reader.onload = function( e ) {
                // if true, send raw data to server
                if ( sendResponse ) {
                  jsonPOST.send_back = "1";
                  jsonPOST.file_name = file.name;
                  jsonPOST.raw_content = e.target.result;
                } else {
                  jsonPOST.hash_sha256 = os.compute_hash( e.target.result )
                }
                xhr.send( JSON.stringify( jsonPOST ) );
              }
            }
          }
        } else {
          if ( sendResponse ) {
            jsonPOST.raw_content = content.value;
          } else {
            jsonPOST.hash_sha256 = os.compute_hash( content.value )
          }

          xhr.send( JSON.stringify( jsonPOST ) );
        }

      }

    }
  }

}(this.OriginStamp = this.OriginStamp || {}));