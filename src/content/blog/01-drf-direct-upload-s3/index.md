---

title: "Using Presigned URLs in Django Rest Framework"
description: "Learn how to implement direct file uploads to Amazon S3 using presigned URLs in a Django Rest Framework project."
date: "10/10/2024"
---

In modern web applications, handling file uploads efficiently and securely is a common requirement. One popular approach is to allow users to upload files directly to Amazon S3, bypassing the need to handle large file transfers on your backend servers. This not only reduces server load but also improves scalability and performance.

In this post, I’ll walk you through how to implement direct file uploads to S3 using **presigned URLs** in a **Django Rest Framework (DRF)** project. This approach involves two main steps:

1. **Generating a presigned upload URL** from the backend.
2. **Uploading the file directly to S3** using the presigned URL.

This method allows the frontend to request an upload URL from the backend, upload the file directly to S3, and then update the file key in the backend. Let’s dive into the details!

---

## Prerequisites

Before implementing this solution, ensure you have the following set up:

1. **Amazon S3 Bucket**: You need an S3 bucket configured in your AWS account. Make sure you have the necessary permissions (e.g., `s3:PutObject`) to upload files to the bucket.

2. **Django Storages**: Install and configure the `django-storages` library, which provides backends for working with cloud storage providers like Amazon S3. You can install it via pip:

   ```bash
   pip install django-storages
   ```

3. **Boto3**: The `boto3` library is required to interact with AWS services, including generating presigned URLs. Install it using pip:

   ```bash
   pip install boto3
   ```

4. **AWS Credentials**: Ensure your Django project has access to AWS credentials. You can configure them in your `settings.py` file or use environment variables:

   ```python
   # settings.py
   AWS_ACCESS_KEY_ID = 'your-access-key-id'
   AWS_SECRET_ACCESS_KEY = 'your-secret-access-key'
   AWS_STORAGE_BUCKET_NAME = 'your-bucket-name'
   AWS_S3_REGION_NAME = 'your-region'  # e.g., 'ap-south-1'
   ```

5. **Django Settings for S3**: Configure `django-storages` to use S3 as the default storage backend:

   ```python
   # settings.py
   DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
   MEDIA_URL = f"https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/media/"
   ```

For more details on configuring `django-storages`, refer to the official documentation: [django-storages Amazon S3 Backend](https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html).

---

## Step 1: Generating the Presigned Upload URL

The backend generates a presigned URL using the `generate_presigned_post` method from the `boto3` library. This URL is returned to the frontend, which can then use it to upload the file directly to S3.

### API Endpoint
- **Method**: `POST`
- **URL**: `https://{base_url}/api/v1/uploads/`

### Request Payload
```json
{
  "original_file_name": "lorem-ipsum.pdf",
  "file_size": "77000"
}
```

### Response
The backend responds with a JSON object containing the presigned URL and necessary fields for the upload. Here’s an example response:

```json
{
  "id": "90bd0986-9a98-40a2-9d94-f3f84eef68d0",
  "original_file_name": "lorem-ipsum.pdf",
  "file_name": "90bd09869a9840a29d94f3f84eef68d0-lorem-ipsum.pdf",
  "file_size": 77000,
  "file_type": "application/pdf",
  "upload_to": "uploads",
  "created_at": "2024-12-11T13:44:14.905229Z",
  "created_by": "5dcf0969-04f3-4d9e-a7d5-fcef0acbf101",
  "presigned_post_data": {
    "url": "https://staging-pfc-media-storage.s3.amazonaws.com/",
    "fields": {
      "key": "media/uploads/90bd09869a9840a29d94f3f84eef68d0-lorem-ipsum.pdf",
      "x-amz-algorithm": "AWS4-HMAC-SHA256",
      "x-amz-credential": "AKIA5ME2BRTXOSEIS74A/20241211/ap-south-1/s3/aws4_request",
      "x-amz-date": "20241211T134414Z",
      "policy": "eyJleHBpcmF0aW9uIjogIjIwMjQtMTItMTFUMTQ6NDQ6MTRaIiwgImNvbmRpdGlvbnMiOiBbeyJidWNrZXQiOiAic3RhZ2luZy1wZmMtbWVkaWEtc3RvcmFnZSJ9LCB7ImtleSI6ICJtZWRpYS91cEwvYWRzLzkwYmQwOTg2OWE5ODQwYTI5ZDk0ZjNmODRlZWY2OGQwLWxvcmVtLWlwc3VtLnBkZiJ9LCB7IngtYW16LWFsZ29yaXRobSI6ICJBV1M1LUhNWSDtU0hBMjU2In0sIHsieC1hbXotY3JlZGVudGlhbCI6ICJBS0lBNU1FMkJSVFhPU0VJUzc0QS8yMDI0MTIxMS9hcC1zb3V0aC0xL3MzL2F3czRfcmVxdWVzdCJ9LCB7IngtYW16LWRhdGUiOiAiMjAyNDEyMTFUMTM0NDE0WiJ9XX0=",
      "x-amz-signature": "a533f85d78d6e9a32dc34d2e0a26f6f43281c5c761c4927ed12b97b8263e4c61"
    }
  }
}
```

---

## Step 2: Uploading to S3 Using the Presigned URL

Once the frontend receives the presigned URL and fields, it can upload the file directly to S3 using a `POST` request. Here’s an example of how to do this using `cURL`:

```bash
curl -X POST \
'https://staging-pfc-media-storage.s3.amazonaws.com/' \
--header 'Accept: */*' \
--form 'key="media/uploads/90bd09869a9840a29d94f3f84eef68d0-lorem-ipsum.pdf"' \
--form 'x-amz-algorithm="AWS4-HMAC-SHA256"' \
--form 'x-amz-credential="AKIA5ME2BRTXOSEIS74A/20241211/ap-south-1/s3/aws4_request"' \
--form 'x-amz-date="20241211T134414Z"' \
--form 'policy="eyJleHBpcmF0aW9uIjogIjIwMjQtMTItMTFUMTQ6NDQ6MTRaIiwgImNvbmRpdGlvbnMiOiBbeyJidWNrZXQiOiAic3RhZ2luZy1wZmMtbWVkaWEtc3RvcmFnZSJ9LCB7ImtleSI6ICJtZWRpYS91cGxvYWRzLzkwYmQwOTg2OWE5ODQwYTI5ZDk0ZjNmODRlZWY2OGQwLWxvcmVtLWlwc3VtLnBkZiJ9LCB7IngtYW16LWFsZ29yaXRobSI6ICJBV1M0LUhNQUMtU0hBMjU2In0s IHsieC1hbXotY3JlZGVudGlhbCI6ICJBS0lBNU1FMkJSVFhPU0VJUzc0QS8yMDI0MTIxMS9hcC1zb3V0aC0xL3MzL2F3czRfcmVxdWVzdCJ9LCB7IngtYW16LWRhdGUiOiAiMjAyNDEyMTFUMTM0NDE0WiJ9XX0="' \
--form 'x-amz-signature="a533f85d78d6e9a32dc34d2e0a26f6f43281c5c761c4927ed12b97b8263e4c61"' \
--form 'file=@/Users/tushar/Work/lorem-ipsum.pdf'
```

---

## Backend Implementation in Django Rest Framework

To implement this functionality in your Django Rest Framework project, you can use the following classes:

### `FileUploadViewSet`
This viewset handles the creation of the `FileUpload` object and generates the presigned URL.

```python
class FileUploadViewSet(viewsets.GenericViewSet, CustomCreateModelMixin):
    queryset = FileUpload.objects.none()
    serializer_class = FileUploadModelSerializer
```

### `FileUploadModelSerializer`
This serializer defines the fields for the `FileUpload` model.

```python
class FileUploadModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = [
            "id",
            "original_file_name",
            "file_name",
            "file_size",
            "file_type",
            "upload_to",
            "created_at",
            "created_by",
            "presigned_post_data",
        ]
        extra_kwargs = {
            "id": {"read_only": True},
            "file_type": {"required": False},
        }
```

### `FileUpload` Model
This model stores the file metadata and generates the presigned URL when a new file is created.

```python
class FileUpload(models.Model):
    original_file_name = models.CharField(max_length=255)
    file_name = models.CharField(max_length=255, unique=True, editable=False)
    file_size = models.PositiveIntegerField()
    file_type = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(null=True, blank=True)
    upload_to = models.CharField(
        max_length=255, default=settings.DEFAULT_FILE_UPLOAD_FOLDER
    )
    presigned_post_data = models.JSONField(default=dict)

    def save(self, *args, **kwargs):
        if self._state.adding:
            file_name, file_extension = tuple(
                self.original_file_name.rsplit(".", maxsplit=1)
            )

            self.file_name = f"{str(self.id.hex).strip()}-{slugify(file_name.strip())}.{file_extension}"
            self.key = f"media/{self.upload_to}/{self.file_name}"
            self.presigned_post_data = create_presigned_post(key=self.key)

        super(FileUpload, self).save(*args, **kwargs)
```

---

## Boto3 Implementation for Generating Presigned URLs

To generate presigned URLs, you can use the following `S3Client` class, which encapsulates the logic for interacting with AWS S3:

```python
import boto3

from botocore.exceptions import ClientError
from botocore.client import Config

from django.conf import settings

class S3Client:
    """
    Docs : https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3/client/generate_presigned_post.html
    """

    def __init__(
        self,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        client_class=boto3.client,
        region_name=settings.AWS_S3_REGION_NAME,
        bucket_name=None,
    ):
        self.config = Config(signature_version=settings.AWS_S3_SIGNATURE_VERSION)
        self.client = client_class(
            "s3",
            region_name=region_name,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            config=self.config,
        )
        self.bucket_name = (
            bucket_name
            if bucket_name is not None
            else settings.AWS_MEDIA_STORAGE_BUCKET_NAME
        )

    def generate_presigned_post(self, key, expiration: int = 3600):
        try:
            response = self.client.generate_presigned_post(
                Bucket=self.bucket_name,
                Key=key,
                ExpiresIn=expiration,
                # Conditions=[{"acl": "private"}],
            )
        except ClientError as e:
            return None

        return response

    def generate_presigned_url(
        self, key, expiration: int = 3600, response_content_type: str = None
    ):
        params: dict = {"Bucket": self.bucket_name, "Key": key}

        if response_content_type:
            params["ResponseContentType"] = response_content_type

        try:
            response = self.client.generate_presigned_url(
                ClientMethod="get_object",
                HttpMethod="GET",
                Params=params,
                ExpiresIn=expiration,
            )
        except ClientError as e:
            return None

        return response
```

---

## Why Use Presigned URLs?

Using presigned URLs for direct S3 uploads offers several benefits:
- **Reduced Server Load**: Files are uploaded directly to S3, bypassing your backend servers.
- **Scalability**: S3 handles the file storage, making it easier to scale your application.
- **Security**: Presigned URLs are time-limited and can be restricted to specific operations (e.g., upload only).

---

## Conclusion

This approach is a clean and efficient way to handle file uploads in a Django Rest Framework project. By leveraging S3’s capabilities and presigned URLs, you can offload file storage and improve the performance of your application.

For more details on generating presigned URLs, refer to the official [boto3 documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3/client/generate_presigned_post.html#generate-presigned-post).

---

If you found this post helpful, feel free to share it or leave a comment below! Happy coding! 🚀

---