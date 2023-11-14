import { 
    S3Client,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    GetObjectCommand,
    ListPartsCommand,
    S3
} from "@aws-sdk/client-s3";
import { access } from '~/assets/ts/access';

let uploadPromises:any= [];

let s3Client
const initS3Client = () => {
    if (s3Client != null) {
        return s3Client
    }
    if (access.region == "") {
        access.region = "us-east-1"
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
    const client = initS3Client()
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

 const getObjectRange = ({ bucket, key, start, end }) => {
    const client = initS3Client()

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      Range: `bytes=${start}-${end}`,
    });
  
    return client.send(command);
  };
  
 const getRangeAndLength = (contentRange) => {
    const [range, length] = contentRange.split("/");
    const [start, end] = range.split("-");
    return {
      start: parseInt(start),
      end: parseInt(end),
      length: parseInt(length),
    };
  };
  
 const isComplete = ({ end, length }) => end === length - 1;
  
 const downloadDirectInChunks = async ({ bucket, key }) => {
    // const writeStream = createWriteStream(
    //   fileURLToPath(new URL(`./${key}`, import.meta.url))
    // ).on("error", (err) => console.error(err));
  
    // let rangeAndLength = { start: -1, end: -1, length: -1 };
  
    // while (!isComplete(rangeAndLength)) {
    //   const { end } = rangeAndLength;
    //   const nextRange = { start: end + 1, end: end + 1024*1024 };
  
    //   console.log(`Downloading bytes ${nextRange.start} to ${nextRange.end}`);
  
    //   const { ContentRange, Body } = await getObjectRange({
    //     bucket,
    //     key,
    //     ...nextRange,
    //   });
  
    //   writeStream.write(await Body.transformToByteArray());
    //   rangeAndLength = getRangeAndLength(ContentRange);
    // }
  };
  
export {uploadPartDirect}