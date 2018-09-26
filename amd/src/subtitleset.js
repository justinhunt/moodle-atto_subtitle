define(["jquery"], function($) {

    //subtitle set is the data layer for the subtitles. its an array of objects,
    // with methods to access and manipulate items and the array.

  return {
       stitles: [],

      init: function(subtitledata){
            this.stitles = subtitledata;
      },

      fetchSubtitleData: function(){
          return this.stitles;
      },

      fetchCount: function(){
          return this.stitles.length;
      },
      addItem: function(index,start,end,part){
          var item = this.makeItem(start,end,part);
          this.stitles.push(item);
      },
      insertItem: function(index,start,end,part){
          var item = this.makeItem(start,end,part);
          this.stitles.splice(index, 0, item);
      },
      removeItem: function(index){
          this.stitles.splice(index, 1);
      },
      fetchItem: function(index){
          return this.stitles[index];
      },

      fetchItemByTime: function(time){
          var setcount = this.fetchCount();
          //start and end times of adjacent tiles can be identical (sucks I know)
          // in that case we choose the start time tile. so we loop backwards here for minor efficiency
          for(var itemindex =setcount-1; itemindex>-1; itemindex--){
              var theitem = this.fetchItem(itemindex);
              if(time >= theitem.start && time <= theitem.end){
                  return itemindex;
              }
          }
          return false;
      },
      updateItem: function(index,start,end,part){
          this.stitles[index].start = start;
          this.stitles[index].end = end;
          this.stitles[index].part = part;
      },
      split: function(index){
        var originalitem = this.fetchItem(index);
        var originalduration = originalitem.end - originalitem.start;

        //if its less than a third of a second our calcs might error(or someone is trying subliminal advertising)
        //lets just stop right here
        if(originalduration < 300){return false;}

        var firststart = originalitem.start;
        var firstend =  originalitem.start + (originalduration / 2) - 100;
        var secondstart = firstend + 200;
        var secondend = originalitem.end;


        this.insertItem(index,firststart,firstend,originalitem.part);
        this.updateItem(index+1,secondstart,secondend,originalitem.part);
        return true;

      },
      mergeUp: function(index){
          //basic error check. Should not get here in this case anyway
          if(!this.canMergeUp(index)){return false;}

          var upperitem = this.fetchItem(index);
          var loweritem = this.fetchItem(index-1);
          this.updateItem(index-1,loweritem.start,upperitem.end, loweritem.part + " " + upperitem.part);
          this.removeItem(index);
          return true;
      },
      canMergeUp: function(index){
          if(index==0 || this.fetchCount()<2){
              return false;
          }else{
              return true;
          }
      },
      makeItem: function(start,end,part){
         return {start: start, end: end, part: part};
      }

    }
});
