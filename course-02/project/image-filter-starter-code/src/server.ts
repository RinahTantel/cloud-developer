import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import fs from 'fs';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage", async ( req: Request, res: Response) => {
    let { image_url } = req.query;

    if ( !image_url ){
     return res.status(400)
          .send("Image Url is required! Please put the image url.");
    }

    // Filter the image and get the promise object
    const image:Promise<string> =  filterImageFromURL(image_url);
    let files: string[] = []; // stock the files names to be deleted by deleteLocalFiles()
    
    //HTTP REQUEST
    // handle the promise object to get the image url
    // read the file image and display it
    image.then(
      function(url){ 
        fs.readFile(url, function(error, file){
          if(error) throw error;
          files.push(url);
          res.writeHead(200, {'Content-Type': 'image/jpeg'});
          res.end(file);
          //Comment deletLocalFiles() to display the image in src/util/temp folder
          deleteLocalFiles(files);
        });
      },
      function(error) { 
        return res.status(404)
                  .send(" <h1> Page not found </h1><h3>The image could not be found/processed. Please check if it's a public image</h3>");
      }
    )
   
  });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();