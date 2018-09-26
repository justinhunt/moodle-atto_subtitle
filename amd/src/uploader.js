define(["jquery"], function($) {
    return{
        // Upload recorded audio/video to server.
        upload_to_server: function(type, callback) {
            var xhr = new window.XMLHttpRequest();

            // Get src media of audio/video tag.
            xhr.open('GET', cm.player.get('src'), true);
            xhr.responseType = 'blob';

            xhr.onload = function() {
                if (xhr.status === 200) { // If src media was successfully retrieved.
                    // blob is now the media that the audio/video tag's src pointed to.
                    var blob = this.response;

                    // Generate filename with random ID and file extension.
                    var fileName = (Math.random() * 1000).toString().replace('.', '');
                    fileName += (type === 'audio') ? '-audio.ogg'
                        : '-video.webm';

                    // Create FormData to send to PHP filepicker-upload script.
                    var formData = new window.FormData(),
                        filepickerOptions = cm.editorScope.get('host').get('filepickeroptions').link,
                        repositoryKeys = window.Object.keys(filepickerOptions.repositories);

                    formData.append('repo_upload_file', blob, fileName);
                    formData.append('itemid', filepickerOptions.itemid);

                    for (var i = 0; i < repositoryKeys.length; i++) {
                        if (filepickerOptions.repositories[repositoryKeys[i]].type === 'upload') {
                            formData.append('repo_id', filepickerOptions.repositories[repositoryKeys[i]].id);
                            break;
                        }
                    }

                    formData.append('env', filepickerOptions.env);
                    formData.append('sesskey', M.cfg.sesskey);
                    formData.append('client_id', filepickerOptions.client_id);
                    formData.append('savepath', '/');
                    formData.append('ctx_id', filepickerOptions.context.id);

                    // Pass FormData to PHP script using XHR.
                    var uploadEndpoint = M.cfg.wwwroot + '/repository/repository_ajax.php?action=upload';
                    cm.make_xmlhttprequest(uploadEndpoint, formData,
                        function(progress, responseText) {
                            if (progress === 'upload-ended') {
                                callback('ended', window.JSON.parse(responseText).url);
                            } else {
                                callback(progress);
                            }
                        }
                    );
                }
            };

            xhr.send();
        },

        // Handle XHR sending/receiving/status.
        make_xmlhttprequest: function(url, data, callback) {
            var xhr = new window.XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if ((xhr.readyState === 4) && (xhr.status === 200)) { // When request is finished and successful.
                    callback('upload-ended', xhr.responseText);
                } else if (xhr.status === 404) { // When request returns 404 Not Found.
                    callback('upload-failed-404');
                }
            };

            xhr.upload.onprogress = function(event) {
                callback(Math.round(event.loaded / event.total * 100) + "% " + M.util.get_string('uploadprogress', 'atto_recordrtc'));
            };

            xhr.upload.onerror = function(error) {
                callback('upload-failed', error);
            };

            xhr.upload.onabort = function(error) {
                callback('upload-aborted', error);
            };

            // POST FormData to PHP script that handles uploading/saving.
            xhr.open('POST', url);
            xhr.send(data);
        }
    }

});
