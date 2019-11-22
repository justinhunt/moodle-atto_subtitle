define(["jquery", "atto_subtitle/constants",
    "atto_subtitle/poodllsubtitle", "atto_subtitle/vtthelper",
    "atto_subtitle/previewhelper","atto_subtitle/uploader"],
    function($, constants, poodllsubtitle, vtthelper, previewhelper, uploader) {

    //Video helper is manipulating the video and passing on video events and info to other parts of app

  return {

      controls: {},
      mediaurl: false,
      host: false,
      sampledata: [
        {start: 6254, end: 11758, part: 'Central downtown Los Angeles'},
        {start: 11882, end: 15184, part: 'Rosslyn Hotel 3'},
        {start: 15256, end: 19190, part: '“Upon Reflection” mural by Fin Dac & Angelina Christina  4'},
        {start: 19220, end: 22559, part: 'Title Guarantee and Trust Company Building feat. "Dusk" mural by Frank Stella  5'},
        {start: 22809, end: 25873, part: 'Statue of Antonio Aguliar  6'},
        {start: 26123, end: 29147, part: 'Eastern Columbia Building  7'},
        {start: 29242, end: 32503, part: 'Los Angeles Jewelry Center  8'},
        {start: 32753, end: 35896, part: 'Union Station  9'},
        {start: 36146, end: 39210, part: '“Urban Bigfoot” mural by Ron English  10'},
        {start: 39460, end: 47195, part: 'Los Angeles Public Library  11'},
        {start: 47445, end: 51259, part: 'Angel City Brewery  12'},
        {start: 51509, end: 54149, part: 'United States Post Office – LA Terminal Annex  13'},
        {start: 54399, end: 57198, part: 'Orpheum Theatre  14'},
        {start: 57448, end: 65231, part: 'Eastern Columbia Building  15'},
        {start: 65481, end: 67801, part: 'Orpheum Theatre  16'},
        {start: 68051, end: 73213, part: 'James Oviatt Building  17'},
        {start: 73463, end: 75870, part: 'Coca-Cola Building  18'},
        {start: 76120, end: 78551, part: 'Herald-Examiner Building  19'},
        {start: 78801, end: 83882, part: 'Bendix Building  20'},
        {start: 84132, end: 86582, part: 'Los Angeles Theatre  21'},
        {start: 86832, end: 89225, part: 'Continental Building  22'},
        {start: 89475, end: 91870, part: '“Peace Goddess” Shepard Fairey  23'},
        {start: 92120, end: 94594, part: 'Joel Bloom Square  24'},
        {start: 94844, end: 97262, part: 'Los Angeles Theatre  25'},
        {start: 97512, end: 99871, part: 'Los Angeles Times Building  26'},
        {start: 100121, end: 102520, part: 'Pacific Mutual Building  27'},
        {start: 102770, end: 105271, part: 'Tower Theatre  28'},
        {start: 105521, end: 107865, part: 'Lady Liberty Building  29'},
        {start: 108115, end: 113166, part: 'Marion R. Gray Building  30'},
        {start: 113416, end: 115894, part: 'Palace Theater  31'},
        {start: 116144, end: 118609, part: 'Supermodel mural: Daniel Lahoda, Leba, LA Freewalls and Vyal  32'},
        {start: 118859, end: 123898, part: 'Ace Hotel  33'},
        {start: 124148, end: 129226, part: 'United Artists Building  34'},
        {start: 129476, end: 139739, part: 'Walt Disney Concert Hall  35'},
        {start: 139989, end: 155899, part: 'Los Angeles Jewelry Center  36'},
        {start: 156149, end: 161202, part: 'Victor Clothing Company  37'},
        {start: 161452, end: 166579, part: '“Redemption of the Angels” Angelina Christina & Fin Dac  38'},
        {start: 166829, end: 171936, part: 'La Iglesia de Nuestra Señora la Reina de los Ángeles  39'},
        {start: 172186, end: 177254, part: 'Mural by Aryz & David Choe  40'},
        {start: 182704, end: 185654, part: '“I Was A Botox Junkie” mural by Tristan Eaton  41'},
        {start: 185904, end: 191500, part: 'Arcade Theater aka Pantages #1  42'},
        {start: 191692, end: 194692, part: 'Broadway Spring Arcade Building  43'},
        {start: 194818, end: 197702, part: 'Hartfields  44'},
        {start: 197858, end: 200775, part: 'Pico House  45'},
        {start: 201025, end: 206789, part: 'United Methodist Church  46'},
        {start: 207039, end: 209862, part: 'Second Church of Christ, Scientist  47'},
        {start: 210112, end: 215917, part: 'Street mural by ROA  48'},
        {start: 216167, end: 221905, part: 'Mayan Theater  49'},
        {start: 222155, end: 227919, part: 'Million Dollar Theatre  50'},
        {start: 228169, end: 231005, part: 'Bristol Hotel (feat. “Westside” mural by JR)  51'},
        {start: 231255, end: 233818, part: 'Commercial Exchange Building  52'},
        {start: 234049, end: 240010, part: 'Pacific Mutual Building  53'},
        {start: 240260, end: 243048, part: 'Biltmore Hotel  54'},
        {start: 243298, end: 249054, part: 'Chinatown  55'},
        {start: 249304, end: 252171, part: 'Los Angeles Public Library  56'},
        {start: 255248, end: 258233, part: 'Rosslyn Hotel  57'},
        {start: 258483, end: 261270, part: 'Dodger Stadium  58'},
        {start: 261520, end: 275799, part: 'Los Angeles downtown'}
        ],  

      init: function(host, uploadCallback, selectedURLs,mediatype){
          this.host = host;
          this.uploadCallback = uploadCallback;

          //if a URL was linked (ie not an html5 player) we guess the mediatype is audio if link is mp3
          var ext = selectedURLs.mediaurl[0].split('.').pop().toLowerCase();
          if(ext=='mp3'){mediatype=constants.mediatype_audio;}

          this.initControls();
          this.initEvents();
          if(selectedURLs.mediaurl){
                this.mediaurl = selectedURLs.mediaurl;
          }

          //poodllsubtitle.init(this.sampledata,mediatype);
          poodllsubtitle.init([],mediatype);
          this.loadMediaAndVtt(selectedURLs.mediaurl,selectedURLs.vtturl);
          // this.runtests();
      },

      loadMediaAndVtt: function(mediaurl,vtturl){
          if(mediaurl && mediaurl.length >0){
              previewhelper.setMediaURL(mediaurl);
          }
          if(vtturl && vtturl != ''){
              $.get(vtturl, function(thevtt) {
                  var thejson = vtthelper.convertVttToJson(thevtt);
                  poodllsubtitle.resetData(thejson);
              });
          }
      },

      runtests: function(){
          //run some tests
          var vtt = vtthelper.convertJsonToVtt(this.sampledata);
          var json = vtthelper.convertVttToJson(vtt);

          console.log(vtt);
          console.log(json);
      },

      initControls: function(){
          this.controls.mediaurl = $(constants.mediaurlinput);
          this.controls.vtturl = $(constants.vtturlinput);
          this.controls.loadbutton = $(constants.loadbutton);
          this.controls.downloadbutton = $(constants.downloadbutton);
          this.controls.savebutton = $(constants.savebutton);
          this.controls.cancelallbutton = $(constants.removeallbutton);
      },

      initEvents: function(){
            var that = this;
             this.controls.loadbutton.click(function(){
                 var mediaurl = that.controls.mediaurl.val().trim();
                 var vtturl = that.controls.vtturl.val().trim();
                 that.loadMediaAndVtt(mediaurl,vtturl);

            });

           this.controls.downloadbutton.click(function(){
                that.do_download();
                return;
           });

           this.controls.savebutton.click(function() {
               that.do_upload();
               return;

           });

           this.controls.cancelallbutton.click(function() {
               var message = M.util.get_string('confirmremovesubtitles',constants.component);
               if (confirm(message)) {
                   that.do_removesubtitles();
               } else {
                   // Do nothing!
               }

           });
      },

      fetch_filename: function(url) {
          url=decodeURIComponent(url);
          url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
          url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
          var filename = url.substring(url.lastIndexOf("/") + 1, url.length);
          return filename;
      },

      do_removesubtitles: function(){
            this.uploadCallback('remove-subtitles');
      },

      do_download: function(){
          //hacky download script
          var element = document.createElement('a');
          var jsondata = poodllsubtitle.fetchSubtitleData();
          var vttdata = vtthelper.convertJsonToVtt(jsondata);
          element.setAttribute('href', 'data:text/vtt;charset=utf-8,' + encodeURIComponent(vttdata));
          element.setAttribute('download', "yoursubtitlefile.vtt");
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
      },

      do_upload: function(){

          //build our filedata
          var jsondata = poodllsubtitle.fetchSubtitleData();
          var vttdata = vtthelper.convertJsonToVtt(jsondata);
          var filedata=vttdata;

          //get our filename
          if(this.mediaurl){
              var filename = this.fetch_filename(this.mediaurl) + '.vtt';
          }else{
              var filename='subtitles_' + (Math.random() * 1000).toString() + '.vtt';
          }
          uploader.upload_to_server(this.host,filedata,filename,this.uploadCallback);
      }
  }
});
