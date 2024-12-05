import express from 'express';
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
	// get the Image URL from query string
	const imgUrl = req.query.image_url;
	// validate Image URL
	const imgRegex = /\.(jpeg|jpg|gif|png)$/i;
	const isValidImgUrl = imgRegex.test(imgUrl);
	console.log(imgUrl);
	console.log(isValidImgUrl);
	
	if (!isValidImgUrl) { // if the Image URL is invalid then return HTTP error code 400
		return res.status(400).json({status: 400, message: "Invalid Image URL."})
	} else { // otherwise, fetch then filter image then return to client
		filterImageFromURL(imgUrl)
			.then((filteredpath) => {
				console.log(filteredpath);
				res.sendFile(filteredpath);
			}).finally((filteredpath) => {
				deleteLocalFiles(filteredpath);
			});
	}
  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
