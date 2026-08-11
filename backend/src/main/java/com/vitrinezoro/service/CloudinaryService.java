package com.vitrinezoro.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

/**
 * Uploads images to Cloudinary using the official Cloudinary Java SDK.
 */
@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final String folder;

    public CloudinaryService(
        @Value("${cloudinary.cloud-name}") String cloudName,
        @Value("${cloudinary.api-key}") String apiKey,
        @Value("${cloudinary.api-secret}") String apiSecret,
        @Value("${cloudinary.folder}") String folder
    ) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret
        ));
        this.folder = folder;
    }

    public String upload(MultipartFile file) {
        try {
            String extension = getExtension(file.getOriginalFilename());
            String publicId = UUID.randomUUID().toString();
            Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", folder,
                    "public_id", publicId,
                    "resource_type", "auto",
                    "overwrite", true
                )
            );
            return result.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Échec de l'upload vers Cloudinary : " + e.getMessage(), e);
        } catch (Exception e) {
            // Catches Cloudinary auth/config errors (e.g. missing/invalid API credentials)
            // so they surface as a readable message instead of a bare 500.
            throw new RuntimeException(
                "Cloudinary a refusé l'upload (vérifie CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET) : "
                    + e.getMessage(), e);
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.'));
    }
}
