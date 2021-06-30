define(["jquery","atto_subtitle/constants", "atto_subtitle/vtthelper","atto_subtitle/subtitleset",
        "atto_subtitle/previewhelper","atto_subtitle/playerhelper","core/templates", "atto_subtitle/dlg_actions"],
    function($, constants, vtthelper, subtitleset, previewhelper, playerhelper, templates,actionsdialog) {

    //pooodllsubtitle helper is about the subtitle tiles and editing

  return {
      controls: {},
      currentindex: false,
      currentitemcontainer: null,
      editoropen: false,

      //set up the subtitle edit session
      init: function(subtitledata,mediatype){
          subtitleset.init(subtitledata);
          previewhelper.init(subtitleset,mediatype);
          playerhelper.init(mediatype);
          this.initControls();
          this.initDialog();
          this.initTiles();
          this.initEvents();

      },

      //set up our internal references to the elements on the page
      initControls: function(){
          this.controls.container = $("#poodllsubtitle_tiles");
          this.controls.editor = $("#poodllsubtitle_editor");
          this.controls.number = $("#poodllsubtitle_editor .numb_song");
          this.controls.edstart = $("#poodllsubtitle_edstart");
          this.controls.edend = $("#poodllsubtitle_edend");
          this.controls.edpart = $("#poodllsubtitle_edpart");
          this.controls.buttondelete = $("#poodllsubtitle_eddelete");
          this.controls.buttonmergeup = $("#poodllsubtitle_edmergeup");
          this.controls.buttonsplit = $("#poodllsubtitle_edsplit");
          this.controls.buttonapply = $("#poodllsubtitle_edapply");
          this.controls.buttoncancel = $("#poodllsubtitle_edcancel");
          this.controls.buttonaddnew = $("#poodllsubtitle_addnew");
          this.controls.buttonstartsetnow = $("#poodllsubtitle_startsetnow");
          this.controls.buttonendsetnow = $("#poodllsubtitle_endsetnow");
          this.controls.buttonstartbumpup = $("#poodllsubtitle_startbumpup");
          this.controls.buttonstartbumpdown = $("#poodllsubtitle_startbumpdown");
          this.controls.buttonendbumpup = $("#poodllsubtitle_endbumpup");
          this.controls.buttonendbumpdown = $("#poodllsubtitle_endbumpdown");
          this.controls.buttonactions = $(constants.actionsbutton);
          this.controls.actionsdialog = $("#poodllsubtitle_dialogue_box_actions");
      },

      //set up our internal references to the elements on the page
      initDialog: function() {
          var that=this;
          actionsdialog.set_dialogue_box(this.controls.actionsdialog);
          templates.render('atto_subtitle/subtitleexportimport',{}).then(
              function(html,js){
                  actionsdialog.setContent(html, that);
              }
          );
      },

      hideEditor: function(){
          this.controls.editor.detach();
          this.controls.editor.hide();
          this.editoropen=false;
      },

      restoreTile: function(){
          var item = subtitleset.fetchItem(this.currentindex);
          var that=this;

          var onend = function(tile){
              that.hideEditor();
              that.currentitemcontainer.append(tile);
          };
          this.fetchNewTextTile(this.currentindex,item.start,item.end,item.part, onend);
      },

      editorToTile: function(controls,currentindex,currentitemcontainer, onend){
          var starttime = vtthelper.timeString2ms($(controls.edstart).val());
          var endtime = vtthelper.timeString2ms($(controls.edend).val());
          var validtimes = this.validateTimes(currentindex,starttime,endtime);
          if(!validtimes){
              $(currentitemcontainer).addClass('warning');
              return false;
          }
          var part = $(controls.edpart).val();
          subtitleset.updateItem(currentindex,starttime,endtime,part);

          var that = this;
          var on_fetch_finish = function(tile){
              that.hideEditor();
              currentitemcontainer.append(tile);
              $(currentitemcontainer).removeClass('warning');
              if(onend){
                  onend();
              }
          };
          this.fetchNewTextTile(currentindex,starttime,endtime,part, on_fetch_finish);

          return true;
      },

      //attach events to the elements on the page
      initEvents: function(){
          var that = this;
          //this attaches event to classes of poodllsubtitle_tt in "container"
          //so new items(created at runtime) get events by default
          this.controls.container.on("click",'.poodllsubtitle_tt',function(){

              var newindex = parseInt($(this).parent().attr('data-id'));
              var theparent = $(this).parent();
              var do_next_tile_edit = function(){
                  that.currentindex = newindex;
                  that.currentitemcontainer = theparent;
                  that.shiftEditor(that.currentindex ,that.currentitemcontainer);
                  previewhelper.setPosition(that.currentindex);
              }
              //save current
              if(that.editoropen === true){
                  that.editorToTile(that.controls,that.currentindex,that.currentitemcontainer, do_next_tile_edit);
              }else{
                  do_next_tile_edit();
              }

           });

          //editor button delete tile click event
          this.controls.container.on("click",constants.C_BUTTONDELETE,function(){
              result = confirm('Warning! This tile is going to be deleted!');
              //we need to combine reset tile here to maintain it all, so its a bit messy.
              //calling reset tile fails because the result arrives after the delete and the deleted item appears again
              if (result) {
                  var item = subtitleset.fetchItem(that.currentindex);
                  var onend = function(tile){
                      that.hideEditor();
                      that.currentitemcontainer.append(tile);
                      subtitleset.removeItem(that.currentindex);
                      that.syncFrom(that.currentindex);
                      previewhelper.updateLabel();
                  };
                  that.fetchNewTextTile(that.currentindex,item.start,item.end,item.part, onend);

              } else {
                  return;
              }

          });

          //editor button merge with prev tile click event
          this.controls.container.on("click", constants.C_BUTTONMERGEUP,function(){
              var onend = function() {
                  subtitleset.mergeUp(that.currentindex);
                  that.syncFrom(that.currentindex - 1);
                  previewhelper.setPosition(that.currentindex - 1);
              };
              that.editorToTile(that.controls,that.currentindex,that.currentitemcontainer, onend);

          });

          //editor button split current tile click event
          this.controls.container.on("click",constants.C_BUTTONSPLIT,function(){
              var onend = function() {
                  subtitleset.split(that.currentindex);
                  that.syncFrom(that.currentindex);
                  previewhelper.updateLabel();
              };
              that.editorToTile(that.controls,that.currentindex,that.currentitemcontainer, onend);

          });

          //editor button apply changesclick event
          this.controls.container.on("click",constants.C_BUTTONAPPLY,function(){
              var onend = function() {
                  previewhelper.updateLabel();
              };
              that.editorToTile(that.controls,that.currentindex,that.currentitemcontainer, onend);

          });

          //editor button cancel changes click event
          this.controls.container.on("click",constants.C_BUTTONCANCEL,function(){
              that.restoreTile();
          });

          //editor set current preview time to start
          this.controls.container.on("click",constants.C_BUTTONSTARTSETNOW,function(){
              var time = previewhelper.fetchCurrentTime();
              var displaytime = vtthelper.ms2TimeString(time);
              that.controls.edstart.val(displaytime);
          });

          //editor set current preview time to end
          this.controls.container.on("click",constants.C_BUTTONENDSETNOW,function(){
              var time = previewhelper.fetchCurrentTime();
              var displaytime = vtthelper.ms2TimeString(time);
              that.controls.edend.val(displaytime);
          });

          //editor bump start time up or down
          this.controls.container.on("click",constants.C_BUTTONSTARTBUMPUP,function(){
              that.doBump(that.controls.edstart,constants.bumpinterval);
          });
          this.controls.container.on("click",constants.C_BUTTONSTARTBUMPDOWN,function(){
              that.doBump(that.controls.edstart,(-1*constants.bumpinterval));
          });

          //editor bump end time up or down
          this.controls.container.on("click",constants.C_BUTTONENDBUMPUP,function(){
              that.doBump(that.controls.edend,constants.bumpinterval);
          });
          this.controls.container.on("click",constants.C_BUTTONENDBUMPDOWN,function(){
              that.doBump(that.controls.edend,(-1*constants.bumpinterval));
          });

          this.controls.edstart.keypress(function(e) {
              var code = (e.keyCode ? e.keyCode : e.which);
              if (!(
                      (code >= 48 && code <= 57) //numbers
                      || (code == 58) //colon
                      || (code == 46) //period
                  )
              )
                  e.preventDefault();
          });

          //"Add new tile" button click event
          this.controls.buttonaddnew.click(function(){
              var currentcount = subtitleset.fetchCount();
              var newdataid=currentcount;
              var newstart=0;
              if(currentcount >0){
                  var lastitem = subtitleset.fetchItem(currentcount-1);
                  newstart = lastitem.end + 500;
              }
              var newend = newstart + 2000;
              subtitleset.addItem(newdataid,newstart,newend,'');

              var onend = function(newtile){that.controls.container.append(newtile);};
              var newtile = that.fetchNewTextTileContainer(newdataid,newstart,newend,'',onend);
          });

          //Actions button click event
          this.controls.buttonactions.click(function() {
                actionsdialog.open();
          });

          //set callbacks for video events we are interested in
          previewhelper.highlightItem = this.highlightContainer;
          previewhelper.deHighlightAll = this.deHighlightAll;

      },

      doBump: function(edcontrol,bumpvalue){
          var displaytime = edcontrol.val();
          if(!vtthelper.validateTimeString(displaytime)){return;}
          var displayms = vtthelper.timeString2ms(displaytime);
          displayms += bumpvalue;
          if(displayms<0){displayms=0;}
          displaytime = vtthelper.ms2TimeString(displayms);
          edcontrol.val(displaytime);
      },

      //each subtitle item has a "text tile" with times and subtitle text that we display
      //when clicked we swap it out for the editor
      //this takes all the subtitle json and creates one tiles on page for each subtitle
      initTiles: function(){
          var container = this.controls.container;
          var that = this;
          var setcount = subtitleset.fetchCount();


          //the first render of template takes time and puts the first tile rendered after subsequent tiles,
          // a better way might be force the order but for now we force an empty first render, and set reallyInitTiles to run after that
          var reallyInitTiles = function() {
              if (setcount > 0) {
                  for (var setindex = 0; setindex < setcount; setindex++) {
                      var item = subtitleset.fetchItem(setindex);
                      var onend = function (newtile) {
                          container.append(newtile);
                      };
                      var newtile = that.fetchNewTextTileContainer(setindex,item.start,item.end, item.part, onend);
                  }
                  ;//end of for loop
              }//end of if setcount
          };
          this.fetchNewTextTile(0,0,0,'',reallyInitTiles);

      },

      //make sure that the times we got back from the editor are sensible
      validateTimes: function(currentindex,newstarttime,newendtime){

          //First simple logic.
          // is new-end after new-start
          if(newendtime <= newstarttime){return false;}

        //Second
        //Is prior end-time before new start-time
        //Is subsequent-start time after new end-time
        var prior = false;
        var subsequent =false;
        if(currentindex >0){
            prior = subtitleset.fetchItem(currentindex-1);
        }
        if(currentindex < subtitleset.fetchCount()-1){
            subsequent = subtitleset.fetchItem(currentindex+1);
        }

        //check starttime
        if(prior && prior.end > newstarttime){
            return false;
        }
          //check endtime
          if(subsequent && subsequent.start < newendtime){
              return false;
          }

          //if its all good, then we can return true
          return true;
      },

      //Replace text tile we are editing with the editor, fill with data and display it
      shiftEditor: function(newindex,newitemcontainer){

          //hide editor
          this.controls.editor.hide();

          //newitem
          var newitem =subtitleset.fetchItem(newindex);

          //set data to editor
          var startstring = vtthelper.ms2TimeString(newitem.start);
          $(this.controls.edstart).val(startstring);

          var endstring = vtthelper.ms2TimeString(newitem.end);
          $(this.controls.edend).val(endstring);

          var part = newitem.part;
          $(this.controls.edpart).val(part);

          //remove old text tile and show editor in its place
          newitemcontainer.empty();
          newitemcontainer.append(this.controls.editor);
          this.controls.editor.show();
          this.editoropen=true;

          $(this.controls.number).text(newindex + 1);

      },

      //Merge a template text tile,  with the time and subtitle text data
      fetchNewTextTile: function(dataid, start, end, part, onend){
          var tdata=[];
          tdata['imgpath'] = M.cfg.wwwroot + '/lib/editor/atto/plugins/subtitle/pix/e/';
          tdata['start'] = vtthelper.ms2TimeString(start);
          tdata['end'] = vtthelper.ms2TimeString(end);
          tdata['dataid'] = dataid+1;
          tdata['part'] = part;

          templates.render('atto_subtitle/subtitletile',tdata).then(
              function(html,js){
                  onend(html);
              }
          );
      },

      //Merge a template text tile,  with the time and subtitle text data
      fetchNewTextTileContainer: function(dataid,start, end, part, onend){
          var tdata=[];
          tdata['imgpath'] = M.cfg.wwwroot + '/lib/editor/atto/plugins/subtitle/pix/e/';
          tdata['start'] = vtthelper.ms2TimeString(start);
          tdata['end'] = vtthelper.ms2TimeString(end);
          tdata['outerdataid'] = dataid;
          tdata['dataid'] = dataid+1;
          tdata['part'] = part;

          templates.render('atto_subtitle/subtitletilecontainer',tdata).then(
              function(html,js){
                  onend(html);
              }
          );
      },

      clearTiles: function(){
          this.controls.container.empty();
      },

      resetData: function(subtitledata){
          this.hideEditor();
          this.clearTiles();
          subtitleset.init(subtitledata);
          this.initTiles();
      },

      syncFrom: function(index){
          var setcount = subtitleset.fetchCount();
          var that =this;
          for(var setindex=index; setindex < setcount;setindex++){
              var item =subtitleset.fetchItem(setindex);
              var container = $('.poodllsubtitle_itemcontainer').filter(function() {
                  return parseInt($(this).attr("data-id")) == setindex;
              });
              if(container.length > 0){
                  this.updateTextTile(container,item);
              }else{
                  var onend = function(newtile){that.controls.container.append(newtile);};
                  var newtile = this.fetchNewTextTileContainer(setindex,item.start,item.end,item.part,onend);
              }
          }
          //remove any elements greater than the last data-id
          $('.poodllsubtitle_itemcontainer').filter(function() {
              return parseInt($(this).attr("data-id")) >= setcount;
          }).remove();
      },
      syncAt: function(index){
          //do something

      },
      updateTextTile: function(container,item){
          var startstring = vtthelper.ms2TimeString(item.start);
          var endstring = vtthelper.ms2TimeString(item.end);
          $(container).find('.poodllsubtitle_tt_start').text(startstring);
          $(container).find('.poodllsubtitle_tt_end').text(endstring);
          $(container).find('.poodllsubtitle_tt_part').text(item.part);

          $(container).find('.poodllsubtitle_tt_start').val(startstring);
          $(container).find('.poodllsubtitle_tt_end').val(endstring);
          $(container).find('.poodllsubtitle_tt_part').text(item.part);
          return;
      },

      highlightContainer: function(setindex){
          //dehighlight the rest
          this.deHighlightAll();

          //get the one
          var highlightcontainer = $('.poodllsubtitle_itemcontainer').filter(function() {
              return parseInt($(this).attr("data-id")) == setindex;
          });
          //highlight the one
          highlightcontainer.addClass('activesubtitle');
      },

      deHighlightAll: function(){
          $('.poodllsubtitle_itemcontainer').removeClass('activesubtitle');
      },

      fetchSubtitleData: function(){
          return subtitleset.fetchSubtitleData();
      }
  }
});
