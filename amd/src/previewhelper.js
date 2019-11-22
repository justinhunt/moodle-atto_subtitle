define(["jquery","atto_subtitle/constants"], function($, constants) {

    //Preview helper manipulates the audio/video and passing on media events and info to other parts of app

  return {

      controls: {},
      activeSubtitle: -1,
      ss: null,
      mediatype: constants.mediatype_video,

      init: function(subtitleset,mediatype){
            this.ss = subtitleset;
            this.mediatype = mediatype;
            this.initControls();
            this.initEvents();
      },

      initControls: function(){
          this.controls.videoplayer = $(constants.videoplayer);
          this.controls.audioplayer = $(constants.audioplayer);
          this.controls.root = $(constants.root);
          if(this.mediatype===constants.mediatype_audio){
              this.controls.mediaplayer = this.controls.audioplayer
          }else {
              this.controls.mediaplayer = this.controls.videoplayer
          }
          this.controls.mediaplayer.show();
          this.controls.previewline = $(constants.previewline);

      },

      initEvents: function(){
         var that = this;
        this.controls.mediaplayer.on('timeupdate',function(e){
          var currenttime = that.fetchCurrentTime();//milliseconds
          var itemindex = that.ss.fetchItemByTime(currenttime);
          if(itemindex===false) {
              that.deactivateAll();

          }else{
              if(that.activeSubtitle!==itemindex) {
                  that.activateSubtitle(itemindex);
              }
          }
        });
      },

      setPosition: function(setindex){
          var theitem = this.ss.fetchItem(setindex);
          if(!theitem){return;}
          this.controls.mediaplayer[0].pause();
          var newcurrenttime = (theitem.start / 1000).toFixed(3);
          this.controls.mediaplayer[0].currentTime= newcurrenttime;
      },
      updateLabel: function(){
          if(this.activeSubtitle>-1){
              this.activateSubtitle(this.activeSubtitle);
          }
      },
      fetchCurrentTime: function(){
         return Math.floor(1000 * this.controls.mediaplayer[0].currentTime);//milliseconds
      },

      setMediaURL: function(mediaurl){
        if(!mediaurl | mediaurl.length<1){return;}
        switch(this.mediatype){
            case constants.mediatype_audio:
                this.mediatype=constants.mediatype_audio;
                this.controls.mediaplayer.off('timeupdate');
                this.controls.mediaplayer = this.controls.audioplayer;
                this.initEvents();

                this.controls.root.addClass('player-audio');
                break;

            default:
                this.mediatype=constants.mediatype_video;
                this.controls.mediaplayer.off('timeupdate');
                this.controls.mediaplayer = this.controls.videoplayer;
                this.initEvents();

                this.controls.root.removeClass('player-audio');
        }
        for(var i=0;i<mediaurl.length;i++) {
            //TO DO ideally we would specify the mime type here eg  type="audio/webm",
            // but its a bit hard to know from file extension
            var newtrack = '<source src="' + mediaurl[i] + '">';
            //we prepend because we seem to get better time stamps off mp3/mp4 so we put those first
            this.controls.mediaplayer.prepend(newtrack);
        }
        this.controls.mediaplayer[0].load();
      },

      activateSubtitle: function(setindex){
          this.highlightItem(setindex);
          this.activeSubtitle = setindex;
          var item = this.ss.fetchItem(setindex);
          if(item) {
              this.controls.previewline.text(item.part);
              this.controls.previewline.show();
          }else{
              this.deactivateAll();
          }

      },
      deactivateAll: function(){
          this.deHighlightAll();
          this.activeSubtitle=-1;
          this.controls.previewline.text('');
      },

      highlightItem: function(setindex){
          //this function is overwritten by poodllsubtitle.js
          //to avoid circular style refs which I hate.
      },

      deHighlightAll: function(){
            //this function is overwritten by poodllsubtitle.js
            //to avoid circular style refs which I hate.
      }


    }
});
