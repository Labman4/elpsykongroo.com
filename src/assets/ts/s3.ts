import { 
    S3Client,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    ListPartsCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { access } from '~/assets/ts/access';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
let uploadPromises:any= [];

let s3Client

const initS3Client = (init:boolean) => {
    if (s3Client != null && !init) {
        return s3Client
    }
    if (access.region == "") {
        if (access.platform == "cloudflare") {
            access.region = "auto"
        } else {
            access.region = "us-east-1"
        }
    };
    const client = new S3Client({ 
        forcePathStyle: true,
        endpoint: access.endpoint,
        credentials: {
            accessKeyId: access.accessKey,
            secretAccessKey: access.accessSecret
        },
        region: access.region
    });
    s3Client = client
    return s3Client
}

const uploadPartDirect = async (data, bucket, key, uploadId, partNum, partSize) => {
    const client = initS3Client(false)
    uploadPromises.push(
        client.send(
            new UploadPartCommand({
            Bucket: bucket,
            Key: key,
            UploadId: uploadId,
            Body: data,
            PartNumber: partNum + 1,
            }),
        ));
    
    if (uploadPromises.length == partSize) {
        await Promise.all(uploadPromises);
        const completeParts = await client.send(new ListPartsCommand({
            Bucket: bucket,
            Key: key,
            UploadId: uploadId
        }))
        await client.send(
            new CompleteMultipartUploadCommand({
                Bucket: bucket,
                Key: key,
                UploadId: uploadId,
                MultipartUpload: {
                Parts: completeParts.Parts.map(({ ETag, PartNumber }) => ({
                    ETag,
                    PartNumber: PartNumber,
                })),
                },
            }),
        );
        s3Client = null;
        uploadPromises = [];
    }
};

const getObjectSignedUrl = async(bucket, key) => {
    const client = initS3Client(false)
    const command = new GetObjectCommand({Bucket: bucket, Key: key});
    return await getSignedUrl(client, command, {expiresIn: 3600})

}

const getObjectBytes = async(bucket, key) => {
    const client = initS3Client(false)
    const resp = await client.send(new GetObjectCommand({Bucket: bucket, Key: key}))
    return await resp.Body.transformToByteArray()

}
export {uploadPartDirect, initS3Client, getObjectSignedUrl, getObjectBytes}