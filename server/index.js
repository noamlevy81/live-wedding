const {S3Client} = require('@aws-sdk/client-s3');
const S3SyncClient = require('s3-sync-client');
const fs = require('fs');

const s3Client = new S3Client({ region: 'eu-west-1', });
s3Client.removeListe
const { sync } = new S3SyncClient({ client: s3Client });

const SYNC_INTERVAL = 5000;
const BUCKET = 'or-and-noam-wedding-bucket/images';
const LOCAL_PATH = './wedding-images';
//Todo: check for credentials workaround

(async () => {
    while (1) {
        const syncOps = await sync(`s3://${BUCKET}`, LOCAL_PATH);
        console.log(syncOps);

        await new Promise(r => setTimeout(r, SYNC_INTERVAL));
    }
})();