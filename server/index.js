const {S3Client} = require('@aws-sdk/client-s3');
const S3SyncClient = require('s3-sync-client');
const Jimp = require('jimp');
const s3Client = new S3Client({
    region: 'eu-west-1',
});
s3Client.removeListe
const {sync} = new S3SyncClient({client: s3Client});

const SYNC_INTERVAL = 5000;
const BUCKET = 'or-and-noam-wedding-bucket/images';
const LOCAL_PATH = './wedding-images';
const MAX_SIZE = 1000;
(async () => {
    while (1) {
        const syncOps = await sync(`s3://${BUCKET}`, LOCAL_PATH);
        console.log("downloaded image: " + syncOps.downloads);
        if (syncOps.downloads) {
            syncOps.downloads.forEach(async (img) => {
                const path = LOCAL_PATH + '/' + img.id
                const image = await Jimp.read(path);
                image.scaleToFit(MAX_SIZE, MAX_SIZE)
                    .write(LOCAL_PATH + '/ready/' + img.id.split('/')[1]);
            })
        }

        await new Promise(r => setTimeout(r, SYNC_INTERVAL));
    }
})();