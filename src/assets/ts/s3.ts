import { 
    S3Client,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    ListPartsCommand,
    GetObjectCommand,
    CreateMultipartUploadCommand,
    ListObjectsV2Command,
    DeleteObjectsCommand,
    DeleteObjectCommand,
    PutObjectCommand
} from "@aws-sdk/client-s3";
import { access } from '~/assets/ts/access';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ListObject } from '~/assets/ts/interface'
import { dayjs } from "element-plus";

let uploadPromises:any= [];

let s3Client

const initS3Client = (init:boolean) => {
    if (s3Client != null && !init) {
        return s3Client
    } else {
        uploadPromises = []
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

const createMultipartUpload = async(bucket, key) => {
    const client = initS3Client(false)
    const multipartUpload = await client.send(
        new CreateMultipartUploadCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
    return multipartUpload.UploadId;
}

const listObjectsCommand = async(bucket) => {
    const client = initS3Client(false)
    const command = new ListObjectsV2Command({
        Bucket: bucket,
        // The default and maximum number of keys returned is 1000. This limits it to
        // one for demonstration purposes.
        MaxKeys: 1000,
      });
    
      try {
        let isTruncated = true;
        let listObject:ListObject[] = [];
        while (isTruncated) {
          const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);
          if (Contents) {
            Contents.map((c) => {
                const obj:ListObject = {
                    key: c.Key,
                    size: c.Size,
                    timestamp: formatTimestamp(c.LastModified)/1000
                }
                listObject.push(obj)
            });
          }
          isTruncated = IsTruncated;
          command.input.ContinuationToken = NextContinuationToken;
        }
        return listObject
      } catch (err) {
        console.error(err);
      }
}

const deleteObjectsCommand = async (bucket, obj) => {
    const client = initS3Client(false)
    const command = new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: obj,
        },
      });
    
      try {
        const { Deleted } = await client.send(command);
        return Deleted
      } catch (err) {
        console.error(err);
      }
}

const deleteObjectCommand = async (bucket, key) => {
    const client = initS3Client(false)
    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key
      });
    
      try {
        const response = await client.send(command);
        return response
      } catch (err) {
        console.error(err);
      }
}

const uploadObjectCommand = async (bucket, key, body) => {
    const client = initS3Client(false)
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
      });
    
      try {
        const response = await client.send(command);
      } catch (err) {
        console.error(err);
      }
}
function formatTimestamp(obj) {
    return dayjs(obj).valueOf();
}

export {uploadPartDirect, initS3Client, getObjectSignedUrl, getObjectBytes, createMultipartUpload, listObjectsCommand, deleteObjectsCommand, deleteObjectCommand, uploadObjectCommand}