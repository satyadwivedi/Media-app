using { sap.satya.media as db } from '../db/data-model';
namespace sap.satya.media;

service MediaServer  {
    entity Media   as projection on db.Media ;
}

 