define(["jquery"], function($) {
    return{
        // Upload VTT file to server
        upload_to_server: function(host, filedata,filename, callback) {


            // Create FormData to send to PHP filepicker-upload script.
            var formData = new window.FormData(),
                filepickerOptions = host.get('filepickeroptions').link,
                repositoryKeys = window.Object.keys(filepickerOptions.repositories);

            //this might blow up with non ascii ... if so ..
           // var senddata = 'data:text/vtt;base64,' + btoa(filedata);
           var senddata = 'data:text/vtt;base64,' + this.unicodebtoa(filedata);

            senddata = this.dataURItoBlob(senddata);

            formData.append('repo_upload_file',senddata,filename);

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
            this.make_xmlhttprequest(uploadEndpoint, formData,callback);
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
                callback(Math.round(event.loaded / event.total * 100) + "% " + M.util.get_string('uploadprogress', 'atto_subtitle'));
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
        },

        dataURItoBlob: function(dataURI) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            var byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);

            // create a view into the buffer
            var ia = new Uint8Array(ab);

            // set the bytes of the buffer to the correct values
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // write the ArrayBuffer to a blob, and you're done
            var blob = new Blob([ab], {type: mimeString});
            return blob;

        },

        //unicode safe btoa ... but does it work???
        unicodebtoa: function(str) {
            // first we use encodeURIComponent to get percent-encoded UTF-8,
            // then we convert the percent encodings into raw bytes which
            // can be fed into btoa.
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode('0x' + p1);
                }));
        }
    }

});
