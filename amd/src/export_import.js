/* jshint ignore:start */
define(['jquery','core/log','atto_subtitle/vtthelper'], function($, log, vtthelper) {

  "use strict"; // jshint ;_;

  log.debug('Atto Subtitle import/export initialising');

  return {

      exportvtt: function(title, jsondata){
          //hacky download script
          var element = document.createElement('a');
          var vttdata = vtthelper.convertJsonToVtt(jsondata);
          element.setAttribute('href', 'data:text/vtt;charset=utf-8,' + encodeURIComponent(vttdata));
          element.setAttribute('download', title + ".vtt");
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
      },


		
		// load all videoeasy stuff and stash all our variables
		init: function(poodllsubtitle) {


			var that = this;
			
			//drag drop square events
			var ddsquareid='#poodllsubtitle_dragdropsquare';
			
			//export the current bundle
			$(ddsquareid).on("click", function(event) {
				var jsondata = poodllsubtitle.fetchSubtitleData();
				that.exportvtt('captions',jsondata);
			});
			
			
			//handle the drop event. First cancel dragevents which prevent drop firing
			$(ddsquareid).on("dragover", function(event) {
				event.preventDefault();  
				event.stopPropagation();
				$(this).addClass('poodllsubtitle_dragging');
			});
			
			$(ddsquareid).on("dragleave", function(event) {
				event.preventDefault();  
				event.stopPropagation();
				$(this).removeClass('poodllsubtitle_dragging');
			});
			
			$(ddsquareid).on('drop', function(event) {

 				//stop the browser from opening the file
 				event.preventDefault();
				 //Now we need to get the files that were dropped
				 //The normal method would be to use event.dataTransfer.files
				 //but as jquery creates its own event object you ave to access 
				 //the browser even through originalEvent.  which looks like this
				 var files = event.originalEvent.dataTransfer.files;
				 
				 //if we have files, read and process them
				 if(files.length){
				 	var f = files[0];
				 	if (f) {
					  var r = new FileReader();
					  r.onload = function(e) { 
						  var vttdata = e.target.result;
						  if(vttdata){
						  	var jsondata = vtthelper.convertVttToJson(vttdata);
                              poodllsubtitle.resetData(jsondata);
						  }
					  }
					  r.readAsText(f);
					} else { 
					  alert("Failed to load file");
					}//end of if f
				}//end of if files
				$(this).removeClass('poodllsubtitle_dragging');
			});
		}//end of function

	}
});
/* jshint ignore:end */