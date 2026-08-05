package com.vitrinezoro.web;

import com.vitrinezoro.config.FileStorageConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageConfig fileStorageConfig;
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    @PostMapping
    public UploadResponse upload(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fichier vide");
            }
            if (file.getSize() > MAX_FILE_SIZE) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fichier trop volumineux (max 5MB)");
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || !isImageFile(originalFilename)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seules les images sont acceptées");
            }

            String filename = UUID.randomUUID() + getFileExtension(originalFilename);
            Path uploadPath = Paths.get(fileStorageConfig.getUploadDir());
            Files.createDirectories(uploadPath);

            Path filePath = uploadPath.resolve(filename);
            Files.write(filePath, file.getBytes());

            return new UploadResponse(fileStorageConfig.getUploadUrl(filename));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur d'upload: " + e.getMessage());
        }
    }

    private boolean isImageFile(String filename) {
        String ext = getFileExtension(filename).toLowerCase();
        return ext.matches("\\.(jpg|jpeg|png|gif|webp)$");
    }

    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot) : "";
    }

    public record UploadResponse(String url) {}
}
