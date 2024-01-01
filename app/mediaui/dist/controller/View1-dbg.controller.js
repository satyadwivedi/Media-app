sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.satya.mediaui.controller.View1", {
            onInit: function () {

            },

            onAfterRendering: function() {
                var oModel = this.getOwnerComponent().getModel('mainModelV2');
                this.getView().setModel(oModel)
                // oModel.read("/Media", {
                //     success: function (oData, oResponce) {
                //         console.log('oData', oData)
                //     },
                //     error: function (oError) {
                //         console.error('oError', oError)
                //     }
                // });
            },
            
            handleUploadComplete: function(oEvent) {
                var sResponse = oEvent.getParameter("response"),
                    aRegexResult = /\d{4}/.exec(sResponse),
                    iHttpStatusCode = aRegexResult && parseInt(aRegexResult[0]),
                    sMessage;
    
                if (sResponse) {
                    sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
                    MessageToast.show(sMessage);
                }
            },

            beforeUploadStart: function(oEvent) {

                console.log('beforeUploadStart')

            },
    
            handleUploadPress: function(oEvent) {
                var oFileUploader = this.byId("fileUploader");
                var oHeaders = oFileUploader.getHeaderParameters();
                // oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                //     name: "Content-Type",
                //     value: ?
                // }));
                let oModelV2 = this.getOwnerComponent().getModel('mainModelV2')
                oModelV2.read('/Media/$count', {
                    success: function(iCount) {
                        console.log('count', iCount)
                        ++iCount
                        let fileName = oFileUploader.getProperty('value')
                        const response = this._fnCreateUploadID (oModelV2, iCount, fileName, 'image/png')
                        let sURI  = "/odata/v4/media-server/Media("+ iCount +")/content"
                        let sUploadURL  = oFileUploader.getUploadUrl()
                        oFileUploader.setUploadUrl(sURI)
                        oFileUploader.checkFileReadable().then(function() {
                            oFileUploader.upload();
                        }, function(error) {
                            MessageToast.show("The file cannot be read. It may have changed.");
                        }).then(function() {
                            oFileUploader.clear();
                        });
                    }.bind(this),
                    error : function(oError) {

                    }.bind(this)
                })
            },

            handleLinkPress: function (oEvent) {
                //MessageBox.alert("Link was clicked!");
                let obj = oEvent.getSource().getBindingContext().getObject();
                let sOrigin = window.location.origin
                let URL = sOrigin + `/odata/v4/media-server/Media(${obj.id})/content`
                console.log('URL', URL)
                oEvent.getSource().setHref(URL)
            },

            _fnCreateUploadID : function (oModel, id, fileName, MIMEType) {
                let oEntry = { 
                        "id": id,
                        "fileName" : fileName,
                        "applicationName": "app1",
                        "mediaType": MIMEType
                };
               
                oModel.create('/Media', oEntry, null, {
                    success: function(oData, oResponce) {
                            console.log("Create successful");
                            resolve(oData);
                    }, 
                    error: function() {
                        console.log("Create failed");
                        reject('Error');
                    }
                })
            }



        });
    });
