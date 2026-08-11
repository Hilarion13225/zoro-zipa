package com.vitrinezoro.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;
import java.util.UUID;

/**
 * Uploads images to Cloudflare R2 (free tier: 10 GB storage, zero egress fees).
 * R2 exposes an S3-compatible API, so we reuse the standard AWS S3 SDK
 * pointed at the account's R2 endpoint.
 */
@Service
public class CloudflareR2Service {

    @Value("${cloudflare.r2.account-id}")
    private String accountId;

    @Value("${cloudflare.r2.access-key}")
    private String accessKey;

    @Value("${cloudflare.r2.secret-key}")
    private String secretKey;

    @Value("${cloudflare.r2.bucket}")
    private String bucket;

    /** Public URL base — either the R2.dev dev domain or a custom domain connected in Cloudflare. */
    @Value("${cloudflare.r2.public-url}")
    private String publicUrl;

    private S3Client client() {
        return S3Client.builder()
            .endpointOverride(URI.create("https://" + accountId + ".r2.cloudflarestorage.com"))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)))
            // R2 ignores the region value but the SDK requires one to be set.
            .region(Region.of("auto"))
            .build();
    }

    public String upload(MultipartFile file) {
        try {
            String extension = getExtension(file.getOriginalFilename());
            String key = UUID.randomUUID() + extension;

            try (S3Client s3 = client()) {
                s3.putObject(
                    PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
                );
            }

            return publicUrl.replaceAll("/$", "") + "/" + key;
        } catch (Exception e) {
            throw new RuntimeException("Échec de l'upload vers Cloudflare R2 : " + e.getMessage(), e);
        }
    }

    public void delete(String key) {
        try (S3Client s3 = client()) {
            s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.'));
    }
}
