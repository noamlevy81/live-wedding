import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PhotoCameraRoundedIcon from "@material-ui/icons/PhotoCameraRounded";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PublishIcon from '@mui/icons-material/Publish';
import { aws_access_key_id, aws_secret_access_key, api_token } from './secrets';
import uuid from 'react-uuid';
import pic from "./title.png";
import axios from 'axios';
const FormData = require('form-data');

  
const S3_BUCKET = 'or-and-noam-wedding-bucket';
const REGION ='eu-west-1';
const ACCESS_KEY = aws_access_key_id;
const SECRET_ACCESS_KEY = aws_secret_access_key;
const API_GW_URL = 'https://dq0a3lqhmc.execute-api.eu-west-1.amazonaws.com/test'
const API_TOKEN = api_token;


const config = {
  bucketName: S3_BUCKET,
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  dirName: 'images',
} 

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    textAlign: 'center',
  },
  imgBox: {
    maxWidth: "80%",
    maxHeight: "80%",
    margin: "10px"
  },
  img: {
    height: "inherit",
    maxWidth: "inherit",
  },
  input: {
    display: "none"
  }
}));


function App() {
  const classes = useStyles();


  const [source, setSource] = useState("");
  const [file, setFile] = useState(null);

  const handleCapture = (target) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const newFile = target.files[0];
        const formData = new FormData();
        formData.append('file', newFile);
        const fileName = `${uuid()}.png`;
        setFile({ file: formData, name: fileName });
        const newUrl = URL.createObjectURL(newFile);
        setSource(newUrl);
      }
    }
  };

  const uploadPicture = async () => {
    if (!file) {
      return;
    }
    
    axios.post(API_GW_URL, { imagePath: file.name, token: API_TOKEN })
      .then(res => {
        console.log(res.data);

        const uploadUrl = res.data['presignedUrl'];
        axios.put(uploadUrl, { data: file.file }, {
          headers: {
            // 'Content-Type': 'x-www-form-urlencoded',
          }}
        ).then(
          res => console.log(res)
        ).catch(
          err => console.error(err)
        );

      });
  };


  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <img src={pic} alt="title" />
          <h5>העלו תמונה לשיתוף על המסך</h5>
          {source &&
            <Grid item xs={12}>
            <Box display="flex" justifyContent="center" border={1} className={classes.imgBox}>
              <img src={source} alt={"snap"} className={classes.img}></img>
              </Box>
              <IconButton
                color="primary"
                aria-label="submit"
                component="span"
                onClick={() => uploadPicture() }
              >

              <PublishIcon fontSize="large" color="secondary" />
          </IconButton>
                </Grid>
          }
          <input
            accept="image/*"
            className={classes.input}
            id="icon-button-file"
            type="file"
            onChange={(e) => handleCapture(e.target)}
          />
          <input
            accept="image/*"
            className={classes.input}
            id="icon-button-take-photo"
            type="file"
            capture="environment"
            onChange={(e) => handleCapture(e.target)}
          />
          <label htmlFor="icon-button-take-photo">
            <IconButton
              color="primary"
              aria-label="take picture"
              component="span"
            >
              <PhotoCameraRoundedIcon fontSize="large" color="primary" />
            </IconButton>
          </label>
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <CloudUploadIcon fontSize="large" color="primary" />
          </IconButton>
          </label>
        </Grid>
      </Grid>
    </div>
  );
}


export default App;