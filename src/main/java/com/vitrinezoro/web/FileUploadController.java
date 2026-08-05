package com.vitrinezoro.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Value("${app.file-storage.upload-dir:uploads}")
    private String uploadDir;

    @PostMapping("/file")
    public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            // Generate UUID for file
            String fileId = UUID.randomUUID().toString();
            String originalFileName = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            String newFileName = fileId + "." + fileExtension;

            // Create upload directory if not exists
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            // Save file
            Path filePath = uploadPath.resolve(newFileName);
            Files.write(filePath, file.getBytes());

            // Return file info with UUID
            Map<String, Object> response = new HashMap<>();
            response.put("fileId", fileId);
            response.put("originalName", originalFileName);
            response.put("fileName", newFileName);
            response.put("url", "/uploads/" + newFileName);
            response.put("size", file.getSize());
            response.put("uploadedAt", new Date());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }

    @GetMapping("/files")
    public ResponseEntity<List<Map<String, Object>>> listFiles() {
        try {
            Path uploadPath = Paths.get(uploadDir);
            List<Map<String, Object>> files = new ArrayList<>();

            if (Files.exists(uploadPath)) {
                Files.list(uploadPath)
                        .filter(Files::isRegularFile)
                        .forEach(filePath -> {
                            try {
                                Map<String, Object> fileInfo = new HashMap<>();
                                String fileName = filePath.getFileName().toString();
                                String fileId = extractFileId(fileName);
                                fileInfo.put("fileId", fileId);
                                fileInfo.put("fileName", fileName);
                                fileInfo.put("url", "/uploads/" + fileName);
                                fileInfo.put("size", Files.size(filePath));
                                fileInfo.put("lastModified", Files.getLastModifiedTime(filePath));
                                files.add(fileInfo);
                            } catch (IOException e) {
                                // Skip files with errors
                            }
                        });
            }

            return ResponseEntity.ok(files);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }
    }

    @DeleteMapping("/file/{fileId}")
    public ResponseEntity<Map<String, String>> deleteFile(@PathVariable String fileId) {
        try {
            Path uploadPath = Paths.get(uploadDir);

            // Find file with matching UUID
            Optional<Path> fileToDelete = Files.list(uploadPath)
                    .filter(p -> p.getFileName().toString().startsWith(fileId))
                    .findFirst();

            if (fileToDelete.isPresent()) {
                Files.delete(fileToDelete.get());
                return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete file"));
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "bin";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    private String extractFileId(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return fileName;
        }
        return fileName.substring(0, fileName.lastIndexOf("."));
    }
}
