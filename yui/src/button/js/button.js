// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_subtitle
 * @copyright  2018 Justin Hunt <justin@poodll.com,>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_align-button
 */

/**
 * Atto text editor subtitle plugin.
 *
 * @namespace M.atto_subtitle
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */
var COMPONENTNAME = 'atto_subtitle';
var SHORTNAME = 'subtitle';
var NODE_TYPE = {LINK: 'LINK', MEDIA: 'MEDIA'};
var MEDIA_TYPES = {LINK: 'LINK', VIDEO: 'VIDEO', AUDIO: 'AUDIO'};
var CSS = {
        VIDEO: 'atto_subtitle_video',
        AUDIO: 'atto_subtitle_audio',
        UPLOAD: 'atto_subtitle_upload',
        SUBTITLE: 'atto_subtitle_subtitle',
        SUBTITLE_CHECKBOX: 'atto_subtitle_subtitle_checkbox',
        MEDIAINSERT_CHECKBOX: 'atto_subtitle_mediainsert_checkbox',
        ATTO_CLOUDPOODLL_FORM: 'atto_subtitle_form',
        CP_VIDEO: 'atto_subtitle_video_cont',
        CP_AUDIO: 'atto_subtitle_audio_cont',
        CP_UPLOAD: 'atto_subtitle_upload_cont',
        CP_SWAP: 'atto_subtitle_swapmeout'

};
var STATE ={
    subtitling: false,
    selectednode: false,
    selectednodetype: false,
    mediaurl: false,
    fullurl: false
};

var TEMPLATES = {
        ROOT: '' +
            '<div class="wrapper">\n' +
        '\n' +
        '            <div class="player" id="root">\n' +
        '\n' +
        '                \n' +
        '\n' +
        '                <div id="poodllsubtitle_previewbox" class="poodllsubtitle_previewbox top-box">\n' +
        '                    <video id="poodllsubtitle_video" class="poodllsubtitle_video" width="100%" style="display: none"></video>\n' +
        '                    <audio id="poodllsubtitle_audio" class="poodllsubtitle_audio" width="100%" style="display: none"></audio>\n' +
        '                    <div id="poodllsubtitle_previewline"  class="poodllsubtitle_previewline text-box"></div>\n' +
        '                </div>\n' +
        '\n' +
        '                <div class="bottom-box">\n' +
        '                    <div class="control-panel">\n' +
        '                        <div class="progress-bar">\n' +
        '                            <span class="time time-current">0:00</span>\n' +
        '                            <div class="progress-line">\n' +
        '                                <span class="green-progress"></span>\n' +
        '                                <span class="progress-marker"></span>\n' +
        '                            </div>\n' +
        '                            <span class="time time-total">0:00</span>\n' +
        '                        </div>\n' +
        '                        <div class="buttons-group">\n' +
        '                            <a id="poodllsubtitle_addnew" class="poodllsubtitle_addnew btn add" title="Add new Subtitle"></a>\n' +
        '                            <a class="btn prev" id="btn_prev" title="Loop Back"></a>\n' +
        '                            <a class="btn play" id="btn_play" title="Play/Pause"></a>\n' +
        '                            <a class="btn next" id="btn_next" title="Loop Forward"></a>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <div class="subtitleset_container">\n' +
        '                        <div id=\'poodllsubtitle_tiles\' class=\'poodllsubtitle_tiles subtitleset_list\'></div>\n' +
        '                        <div class="save_and_download">\n' +
        '                            <a class="save_btn" href="#" id="poodllsubtitle_save">Save and download</a>\n' +
        '                            <a class="cancel_btn" href="#" id="poodllsubtitle_cancelall" title="Cancel all Changes"></a>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '\n' +
        '                <div id=\'poodllsubtitle_editor\' class="\'poodllsubtitle_editor\' subtitleset_block subtitleset_block_open" style=\'display: none;\'>\n' +
        '                        <div class="numb_song"></div>\n' +
        '                        <div class="subtitleset_time">\n' +
        '                            <div class="block_input">\n' +
        '                                <input type="text" name="poodllsubtitle_edstart" id="poodllsubtitle_edstart" class="poodllsubtitle_edstart">\n' +
        '                                <div class="input_arr_block">\n' +
        '                                    <div class="input_arr input_arr_top"></div>\n' +
        '                                    <div class="input_arr input_arr_bot"></div>\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                            <button type="button" id="poodllsubtitle_startsetnow" class="poodllsubtitle_startsetnow now_btn">Now</button>\n' +
        '                            <div class="block_input">\n' +
        '                                <input type="text" name="poodllsubtitle_edend" id="poodllsubtitle_edend" class="poodllsubtitle_edpart">\n' +
        '                                <div class="input_arr_block">\n' +
        '                                    <div class="input_arr input_arr_top"></div>\n' +
        '                                    <div class="input_arr input_arr_bot"></div>\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                            <button type="button" id="poodllsubtitle_endsetnow" class="poodllsubtitle_endsetnow now_btn">Now</button>\n' +
        '                        </div>\n' +
        '                        <div class="subtitleset_text">\n' +
        '                            <textarea class="textarea" name="poodllsubtitle_edpart" id="poodllsubtitle_edpart" class="poodllsubtitle_edpart"></textarea>\n' +
        '                        </div>\n' +
        '                        <div class="subtitleset_btns">\n' +
        '                            <div class="subs_btn_block subs_basket poodllsubtitle_eddelete" id="poodllsubtitle_eddelete">\n' +
        '                                <img src="{{imgpath}}btn_ic_1.svg">\n' +
        '                            </div>\n' +
        '                            <div class="subs_btn_block subs_btn_menu poodllsubtitle_edapply" id="poodllsubtitle_edapply"></div>\n' +
        '                            <div class="subs_btn_block poodllsubtitle_edmergeup" id="poodllsubtitle_edmergeup">\n' +
        '                                <img src="{{imgpath}}btn_ic_2.svg">\n' +
        '                            </div>\n' +
        '                            <div class="subs_btn_block poodllsubtitle_edsplit" id="poodllsubtitle_edsplit">\n' +
        '                                <img src="{{imgpath}}btn_ic_3.svg">\n' +
        '                            </div>\n' +
        '                            <button type="button" id="poodllsubtitle_edcancel" class="poodllsubtitle_edcancel">Cancel</button>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '\n' +
        '            </div>\n' +
        '        </div>',
        HTML_MEDIA: {
            VIDEO: '' +
                '&nbsp;<video ' +
            '&nbsp;<audio ' +
            'controls="true" crossorigin="anonymous"' +
            '>' +
            '<source src="{{url}}">' +
            "{{#if issubtitling}}" +
            '<track src="{{subtitleurl}}" kind="caption" srclang="{{language}}" label="{{language}}" default="true">' +
            "{{/if}}" +
                '</video>&nbsp;',
            AUDIO: '' +
                '&nbsp;<audio ' +
                    'controls="true" crossorigin="anonymous"' +
                '>' +
                    '<source src="{{url}}">' +
            "{{#if issubtitling}}" +
            '<track src="{{subtitleurl}}" kind="caption" srclang="{{language}}" label="{{language}}" default="true">' +
            "{{/if}}" +
                '</audio>&nbsp;',
            LINK: '' +
                '&nbsp;<a href="{{url}}" ' +
            "{{#if issubtitling}}" +
            ' data-subtitles="{{subtitleurl}}" data-language="{{language}}" ' +
            "{{/if}}" +
                '>{{name}}</a>&nbsp;'
         }
};



Y.namespace('M.atto_subtitle').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    initializer: function(config) {

            // Add the poodll button first (if we are supposed to)
            if(!config.disabled){
                this.addButton({
                    icon: SHORTNAME,
                    iconComponent: COMPONENTNAME,
                    title: 'subtitle',
                    buttonName: SHORTNAME,
                    callback: this._displayDialogue,
                    callbackArgs: null,

                    // Watch the following tags and add/remove highlighting as appropriate:
                    tags: 'a,video,audio',
                    tagMatchRequiresAll: false
                });
            }
    },

    /**
     * Gets the root context for all templates, with extra supplied context.
     *
     * @method _getContext
     * @param  {Object} extra The extra context to add
     * @return {Object}
     * @private
     */
    _getContext:
        function(extra) {
            return Y.merge({
                elementid: this.get('host').get('elementid'),
                imgpath: M.cfg.wwwroot + '/lib/editor/atto/plugins/subtitle/pix/e/',
                component: COMPONENTNAME,
                helpStrings: this.get('help'),
                CSS: CSS
            }, extra);
        },



    /**
     * Display the media editing tool.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function(e,recorder) {

        //whats this?
        if (this.get('host').getSelection() === false) {
            return;
        }

        //Set size and title
        var title = M.util.get_string('subtitle', COMPONENTNAME);
        var width = '1200px';

        var d_conf = {};
        d_conf.headerContent =title;
        d_conf.focusAfterHide = SHORTNAME;
        d_conf.width = width;
        //d_conf.height=height;

        var dialogue = this.getDialogue(d_conf);

        // Set the dialogue content, and then show the dialogue.
        dialogue.set('bodyContent', this._getDialogueContent()).show();

        //store some common elements we will refer to later
        STATE.elementid = this.get('host').get('elementid');
        var that=this;

        //so finally load those recorders
        this._loadSubtitleEditor();
    },


    /**
     * Loads or reloads the recorders
     *
     * @method _loadRecorders
     * @private
     */
    _loadSubtitleEditor: function(){
        var that = this;
        var host = this.get('host');
        that.uploaded=false;

        //get our selected URLs (either from media tags or anchor links)
        var medium = host.getSelectedNodes().filter('video,audio').shift();
        if(medium){
            var selectedURLs = this._fetchSelectedURLs_mediatag(medium);
            STATE.selectednode = medium;
            STATE.selectednodetype = NODE_TYPE.MEDIA;
        }else{
            STATE.selectednodetype = NODE_TYPE.LINK;
            var selectedURLs = this._fetchSelectedURLs_anchor();
        }
        STATE.mediaurl = selectedURLs.mediaurl;
        STATE.fullurl = selectedURLs.fullurl;

        var uploadcallback = function(eventtype, responseText) {

            if (eventtype === 'upload-ended') {
                var url = false;
                var response = window.JSON.parse(responseText);
                if(response) {
                    if ('url' in response) {
                        url = response.url;
                    }
                    else if('newfile' in response)
                    {
                        url = response.newfile.url;
                    }
                }

                //if we got a URL we use it, else we error out
                if(url){
                    that._updateAndClose(url);
                }else{
                    //ouch that didn't work .. lets download so the user doesn't lose all their work
                    alert(M.util.get_string('uploadproblem', COMPONENTNAME));
                    loader.do_download();
                }
            } else {
                //no need to do anything really
                //console.log(eventtype);
            }
        };



        require(['atto_subtitle/loader'], function(loader) {
            loader.init(host,uploadcallback,selectedURLs);
        });
    },

    /**
     * If there is selected text and it is part of an anchor link,
     * extract the url (and target) from the link (and set them in the form).
     *
     * @method _resolveAnchors
     * @private
     */
    _fetchSelectedURLs_mediatag: function(medium) {


        //Search for Media tags
        var urls = {mediaurl: false, vtturl: false, fullurl: false};
        var mediumProperties = medium ? this._getMediumProperties(medium) : false;

        if(mediumProperties){
            if(mediumProperties.sources && mediumProperties.sources.length > 0) {
                urls.mediaurl = mediumProperties.sources[0];
            }else{
                urls.mediaurl = mediumProperties.src;
            }
            urls.fullurl = urls.mediaurl;
            if(mediumProperties.tracks && 'captions' in mediumProperties.tracks && mediumProperties.tracks['captions'].length > 0 ) {
                urls.vtturl = mediumProperties.tracks['captions'][0].src;
            }
        }
        return urls;
    },

    /**
     * Extracts medium properties.
     *
     * @method _getMediumProperties
     * @param  {Y.Node} medium The medium node from which to extract
     * @return {Object}
     * @private
     */
    _getMediumProperties: function(medium) {
        var boolAttr = function(elem, attr) {
            return elem.getAttribute(attr) ? true : false;
        };

        var tracks = {
            subtitles: [],
            captions: [],
            descriptions: [],
            chapters: [],
            metadata: []
        };

        medium.all('track').each(function(track) {
            tracks[track.getAttribute('kind')].push({
                src: track.getAttribute('src'),
                srclang: track.getAttribute('srclang'),
                label: track.getAttribute('label'),
                defaultTrack: boolAttr(track, 'default')
            });
        });

        return {
            type: medium.test('video') ? MEDIA_TYPES.VIDEO : MEDIA_TYPES.AUDIO,
            sources: medium.all('source').get('src'),
            src: medium.getAttribute('src'),
            poster: medium.getAttribute('poster'),
            width: medium.getAttribute('width'),
            height: medium.getAttribute('height'),
            autoplay: boolAttr(medium, 'autoplay'),
            loop: boolAttr(medium, 'loop'),
            muted: boolAttr(medium, 'muted'),
            controls: boolAttr(medium, 'controls'),
            tracks: tracks
        };
    },

    /**
     * If there is selected text and it is part of an anchor link,
     * extract the url (and target) from the link (and set them in the form).
     *
     * @method _resolveAnchors
     * @private
     */
    _fetchSelectedURLs_anchor: function() {

        // Find the first anchor tag in the selection.
        var selectednode = this.get('host').getSelectionParentNode();
        var anchornodes = null;
        var anchornode = null;
        var urls = {mediaurl: false, vtturl: false, fullurl: false};


        // Note this is a document fragment and YUI doesn't like them.
        if (!selectednode) {
            return urls;
        }

        anchornodes = this._findSelectedAnchors(Y.one(selectednode));
        if (anchornodes.length > 0) {
            anchornode = anchornodes[0];
            STATE.selectednode = anchornode;
            urls.fullurl = anchornode.getAttribute('href');
            urls.mediaurl=urls.fullurl;

            if(urls.fullurl!=""){
                var tempurl = new URL(urls.fullurl);
                var urlParams = new URLSearchParams(tempurl.search);
                if(urlParams) {
                    urls.vtturl = urlParams.get('data-subtitles');
                    urls.mediaurl=urls.fullurl.replace(tempurl.search,'');
                }
            }
        }
        return urls;
    },




    /**
     * Look up and down for the nearest anchor tags that are least partly contained in the selection.
     *
     * @method _findSelectedAnchors
     * @param {Node} node The node to search under for the selected anchor.
     * @return {Node|Boolean} The Node, or false if not found.
     * @private
     */
    _findSelectedAnchors: function(node) {
        var tagname = node.get('tagName'),
            hit, hits;

        // Direct hit.
        if (tagname && tagname.toLowerCase() === 'a') {
            return [node];
        }

        // Search down but check that each node is part of the selection.
        hits = [];
        node.all('a').each(function(n) {
            if (!hit && this.get('host').selectionContainsNode(n)) {
                hits.push(n);
            }
        }, this);
        if (hits.length > 0) {
            return hits;
        }
        // Search up.
        hit = node.ancestor('a');
        if (hit) {
            return [hit];
        }
        return [];
    },

    /**
     * Returns the dialogue content for the tool.
     *
     * @method _getDialogueContent
     * @param  {WrappedRange[]} selection Current editor selection
     * @return {Y.Node}
     * @private
     */
    _getDialogueContent: function(selection) {
        var content = Y.Node.create(
            Y.Handlebars.compile(TEMPLATES.ROOT)(this._getContext())
        );
        return content;
    },

    _updateAndClose: function(url){
        var updated = false;

        //if this is a media selection
        if(STATE.selectednodetype==NODE_TYPE.MEDIA) {
            STATE.selectednode.all('track').each(function (track) {
                if (track.getAttribute('kind') == 'captions' && !updated) {
                    track.setAttribute('src', url);
                    updated = true;
                }
            });
        }else{
          //if this is an anchor selection
            var tempurl = new URL(STATE.fullurl);
            var useparams = '';
            var urlParams = new URLSearchParams(tempurl.search);
            if (urlParams) {
                urlParams.set('data-subtitles', url);
                useparams = urlParams.toString();
            } else {
                useparams = '?data-subtitles=' + url;
            }
            //lets decode the funny characters, or Moodle wont shift vtt file from draft -> permanent
            useparams = decodeURIComponent(useparams);

            tempurl.search = useparams;
            STATE.selectednode.setAttribute('href', tempurl.href);
        }


        this.getDialogue({
            focusAfterHide: null
        }).hide();
        this.markUpdated();
    }
}, { ATTRS: {
    disabled: {
        value: false
    }
}
});