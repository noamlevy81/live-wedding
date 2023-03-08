import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PhotoCameraRoundedIcon from "@material-ui/icons/PhotoCameraRounded";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PublishIcon from '@mui/icons-material/Publish';
import uuid from 'react-uuid';
import pic from "./title.png";
import axios from 'axios';


const API_GW_URL = 'https://dq0a3lqhmc.execute-api.eu-west-1.amazonaws.com/test'
import { api_token } from './secrets';
const API_TOKEN = api_token;



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
        const fileName = `${uuid()}.png`;
        setFile({ file: newFile, name: fileName });
        const newUrl = URL.createObjectURL(newFile);
        setSource(newUrl);
      }
    }
  };

  const uploadPicture = async () => {
    if (!file) {
      return;
    }
    console.log("logging file: ")
    console.log(file)
    axios.post(API_GW_URL, { imagePath: file.name, token: API_TOKEN })
      .then(res => {
        console.log(res.data);

        const uploadUrl = res.data['presignedUrl'];
        console.log(uploadUrl);
        fetch(uploadUrl, {
          method: "PUT",
          body: file["file"],
        })
            .then(
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