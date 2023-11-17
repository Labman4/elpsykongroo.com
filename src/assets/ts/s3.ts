import { 
    S3Client,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    ListPartsCommand,
    PutBucketCorsCommand
} from "@aws-sdk/client-s3";
import { access } from '~/assets/ts/access';

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
    const corsCommand = new PutBucketCorsCommand({
        Bucket: bucket,
        CORSConfiguration: {
          CORSRules: [
            {
              // Allow all headers to be sent to this bucket.
              AllowedHeaders: ["*"],
              // Allow only GET and PUT methods to be sent to this bucket.
              AllowedMethods: ["GET", "PUT"],
              // Allow only requests from the specified origin.
              AllowedOrigins: ["https://elpsykongroo.com","https://preview.elpsykongroo.com"],
              // Allow the entity tag (ETag) header to be returned in the response. The ETag header
              // The entity tag represents a specific version of the object. The ETag reflects
              // changes only to the contents of an object, not its metadata.
              ExposeHeaders: ["ETag"],
              // How long the requesting browser should cache the preflight response. After
              // this time, the preflight request will have to be made again.
              MaxAgeSeconds: 3600,
            },
          ],
        },
      })
      try {
        await client.send(corsCommand);
      } catch (err) {
        console.error(err);
      }
    uploadPromises.push(
        client.send(
            new UploadPartCommand({
            Bucket: bucket,
            Key: key,
            UploadId: uploadId,
            Body: data,
            PartNumber: partNum + 1,
            }),
        )
        .then((d) => {
            // console.log("Part", partNum + 1, "uploaded");
            return d
        }),
    );
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
  
export {uploadPartDirect,initS3Client}