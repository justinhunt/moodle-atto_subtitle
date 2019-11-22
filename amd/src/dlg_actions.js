define(['jquery', 'jqueryui', 'core/log', 'atto_subtitle/export_import'], function ($, jqui, log, exportimport) {
    "use strict"; // jshint ;_;

    log.debug('Atto Subtitle Dialog: initialising');
    /*how this works
    * The host of the dialog, sets the jquery object pointing to the dialog html in
    * set_dialogue_box. That will be enough to make the dialog open and close.
    * */

    return {
        dlgbox: null,
        headertext: '',

        init: function () {

        },
        //for making multiple instances
        clone: function () {
            return $.extend(true, {}, this);
        },

        setHeader: function (headertext) {
            this.headertext = headertext;
        },
        setContent: function (content,poodllsubtitle) {
            this.clear();
            this.dlgbox.append(content);
            exportimport.init(poodllsubtitle);
        },
        clear: function () {
            this.dlgbox.children().last().remove();
        },

        open: function () {
            this.dlgbox.toggle('slide', {direction: 'left'}, 400);
        },
        close: function () {
            var self = this;
            this.dlgbox.toggle('slide', {direction: 'left', complete: self.onclose}, 400);
        },

        onclose: function () {

        },

        test: function () {
            log.debug('hio');
        },

        set_dialogue_box: function (dlgbox) {
            this.dlgbox = dlgbox;
            var that = this;

            dlgbox.find('.poodllsubtitle_close_modal').click(function () {
                that.close();
            });
        }
    }
});