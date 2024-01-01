const loki = require('lokijs')
const db = new loki('DB')
const mediaDB = db.addCollection('Media')
const { Readable, PassThrough } = require('stream')
const cds = require('@sap/cds')

module.exports = srv => {
    const { Media } = cds.entities
  srv.before('CREATE', 'Media', req => {
    //const obj = mediaDB.insert({ media: '' })
    //req.data.id = obj.$loki
    console.log('before CREATE')
  })
/*
  srv.on('UPDATE', 'Media', async (req, next) => {
    const url = req._.req.path
    if (url.includes('content')) {
      let id = req.data.id
      console.log('id', id)
      id--;
      const obj = await SELECT.from(Media).where({id:id})
      console.log('obj', obj)
      if (!obj) {
        req.reject(404, 'No record found for the ID')
        return
      }
      const stream = new PassThrough()
      const chunks = []
      stream.on('data', chunk => {
        chunks.push(chunk)
      })
      stream.on('end', () => {
        //console.log('chunks', chunks)
        obj[0].content = Buffer.concat(chunks).toString('base64')
        //console.log('base64', obj.content)
        //obj[0].content = Buffer.concat(chunks).toString('hex')
       // console.log('hex=', obj[0].content)
       // mediaDB.update(obj)
       //cds.run(UPDATE(Media).with({content:obj[0].content}).where({id: obj[0].id}))
       
      })
      req.data.content.pipe(stream)
    } else return next()
  })
*/
    
  srv.on('READ', 'Media', async (req, next) => {
    const url = req._.req.path
    if (url.includes('content')) {
      const id = req.data.id
      const mediaObj =  await SELECT.from(Media).where({id:id}) //mediaDB.get(id)
      console.log('mediaObj', mediaObj)
      if (!mediaObj) {
        req.reject(404, 'Media not found for the ID')
        return
      }
      // const decodedMedia = Buffer.from(
      //   mediaObj[0].content.split(';base64,').pop(),
      //   'base64'
      // )
      // let decodedMedia =''
      // for (var i in mediaObj) {
      //   decodedMedia = Buffer.from((mediaObj[i].content.toString()).split(';base64,').pop(),'base64')
      // }
      const decodedMedia = Buffer.from( mediaObj[0].content,'hex')
      
      return _formatResult(decodedMedia)
    } else return next() //> delegate to next/default handlers
  })
  
  srv.on('DELETE', 'Media', (req, next) => {
    const id = req.data.id
    mediaDB
      .chain()
      .find({ $loki: id })
      .remove()
    return next() //> delegate to next/default handlers
  })

  function _formatResult (decodedMedia) {
    const readable = new Readable()
    const result = new Array()
    readable.push(decodedMedia)
    readable.push(null)
    result.push({ value: readable })
    return result
  }

  //===========================================================================================
  /*
  srv.on('UPDATE', 'Media', async (req, next) => {
    const url = req._.req.path, chunks = [];
    if (url.includes('content')) {
      let mediaMalwareScanner = function (req) {
        let malwarescan = new Promise(function (resolve, reject) {
          req.data.content.on('data', chunk => chunks.push(chunk));
          req.data.content.on('end', async (req) => {
            let body = Buffer.concat(chunks).toString('binary');
           // let requestBuilder = await apiMalwareScan.DefaultApi.createScan(body);
           // requestBuilder.addCustomHeaders({ 'Content-Type': 'application/octet-stream' });
           // requestBuilder.addCustomHeaders({ 'Accept': 'application/json' });
           // let response = await requestBuilder.skipCsrfTokenFetching().execute({ destinationName: 'cap-media-malwarescanner-dest' });
            resolve(false);
          });
        });
        return malwarescan;
      }

      let isMalwareDetected = await mediaMalwareScanner(req);
      if (isMalwareDetected) {
        req.error(500, 'Malware Detected');
      } else {
        req.data.content = new PassThrough();
        req.data.content.push(Buffer.concat(chunks));
        req.data.content.push(null);
        next()
      }

    } else {
      return next();
    }

  });
  */

}
