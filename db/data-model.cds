namespace sap.satya.media;

entity Media {

   key id:Integer;
       @Core.IsMediaType: true
       mediaType : String;
       //@Core.MediaType: mediaType
       content : LargeBinary @Core.MediaType: mediaType @Core.ContentDisposition.Filename: fileName;
       fileName : String;
       applicationName:String;
}