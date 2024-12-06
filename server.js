import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';
import fs from 'node:fs';

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/filteredimage", async (req, res) => {
	// const op = {
    //     root: path.join(__dirname)
    // };
	// get the Image URL from query string
	const imgUrl = req.query.image_url;
	// validate Image URL
	const imgRegex = /\.(jpeg|jpg|gif|png)$/i;
	const isValidImgUrl = (imgRegex !== null && imgRegex.test(imgUrl));
	console.log('imgUrl: ' + imgUrl);
	console.log('isValidImgUrl: ' + isValidImgUrl);
	
	if (!isValidImgUrl) { // if the Image URL is invalid then return HTTP error code 400
		return res.status(400).send('Invalid Image URL.');
	} else { // otherwise, fetch then filter image then return to client
		try {
			const filteredpath = await filterImageFromURL(imgUrl);
			console.log('preparing send file to client...');
			res.status(200).sendFile(filteredpath, async() => {
				await deleteLocalFiles(filteredpath)
			});
		} catch (error) {
			res.status(422).send('Unprocessable Content.');
		}
	}
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
	res.send("try GET /filteredimage?image_url={{}}")
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
