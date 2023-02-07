import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PhotoCameraRoundedIcon from "@material-ui/icons/PhotoCameraRounded";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PublishIcon from '@mui/icons-material/Publish';
import { uploadFile } from 'react-s3';
import { aws_access_key_id, aws_secret_access_key } from './secrets';
import uuid from 'react-uuid';

const S3_BUCKET = 'or-and-noam-wedding-bucket';
const REGION ='eu-west-1';
const ACCESS_KEY = aws_access_key_id;
const SECRET_ACCESS_KEY = aws_secret_access_key;

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
        const file = target.files[0];
        const myNewFile = new File(
          [file],
          `${uuid()}.png`,
          { type: file.type }
        );
        setFile(myNewFile);
        const newUrl = URL.createObjectURL(file);
        setSource(newUrl);
      }
    }
  };

  const uploadPicture = async () => {
    if (!file) {
      return;
    }
    uploadFile(file, config)
      .then(data => { console.log(data); setSource(""); })
      .catch(err => console.error(err))

  };


  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <h1>החתונה של אור ונועם!</h1>
          <h5>העלה תמונה לשיתוף על המסך!</h5>
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