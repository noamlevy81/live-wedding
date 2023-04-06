import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import PublishIcon from '@mui/icons-material/Publish';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CollectionsIcon from '@mui/icons-material/Collections';
import uuid from 'react-uuid';
import titlePic from "./title.png";
import successPic from "./success.png"
import axios from 'axios';


const API_GW_URL = 'https://dq0a3lqhmc.execute-api.eu-west-1.amazonaws.com/test'
import { api_token } from './secrets';
const API_TOKEN = api_token;


const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
        textAlign: 'center',
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
                setFile({file: newFile, name: fileName});
                const newUrl = URL.createObjectURL(newFile);
                setSource(newUrl);
            }
        }
    };

    const uploadPicture = async () => {
        if (!file) {
            return;
        }
        setSource(successPic)
        console.log("logging file: ")
        console.log(file)
        axios.post(API_GW_URL, {imagePath: file.name, token: API_TOKEN})
            .then(res => {
                console.log(res.data);

                const uploadUrl = res.data['presignedUrl'];
                console.log(uploadUrl);
                fetch(uploadUrl, {
                    method: "PUT",
                    body: file["file"],
                })
            });
    };


    return (
        <div className={classes.root}>
            <Grid container   alignItems="center">
                <Grid item xs={12} alignItems="center">
                    <img src={titlePic} alt="title" style={{maxWidth: "100%"}}/>
                    <h5> &#x1F603; העלו תמונה לשיתוף על המסך</h5>
                    {source &&
                        <Grid Container item xs={12} alignItems="center" >
                            <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" >
                                <img src={source} alt={"snap"} className={classes.img} style={{maxWidth: "70%"}}></img>
                                { source.includes('success') &&
                                    <h5> &#x1F44F; &#x1F44F; &#x1F44F; אליפות </h5>}
                                { source.includes('success') &&
                                    <h5> &#x1f943; עכשיו הזמינו מישהו לצ׳ייסר </h5>}
                            </Box>
                            { !source.includes('success') &&
                                <Button
                                style={{margin: '5px'}}
                                color="primary"
                                aria-label="submit"
                                variant="outlined"
                                size="large"
                                component="span"
                                endIcon={<PublishIcon />}
                                onClick={() => uploadPicture()}
                            >
                            העלה/י
                            </Button>
                            }
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
                    <label htmlFor="icon-button-take-photo" style={{margin: '4px'}}>
                        <Button
                            variant="outlined"
                            color="primary"
                            aria-label="take picture"
                            component="span"
                            endIcon={<PhotoCamera />}
                        >
                            צלמ/י
                        </Button>
                    </label>
                    <label htmlFor="icon-button-file" style={{margin: '4px'}}>
                        <Button
                            variant="outlined"
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                            endIcon={<CollectionsIcon />}
                        >גלריה
                        </Button>
                    </label>
                </Grid>
            </Grid>
        </div>
    );
}


export default App;