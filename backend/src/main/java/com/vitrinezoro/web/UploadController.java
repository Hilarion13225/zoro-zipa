package com.vitrinezoro.web;

import com.vitrinezoro.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    @PostMapping
    public UploadResponse upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fichier vide");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fichier trop volumineux (max 5MB)");
        }

        // The filename/extension is fully attacker-controlled (a malicious file can be
        // renamed to "photo.jpg"), so it's only used for a cheap first check.
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isImageFile(originalFilename)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seules les images sont acceptées");
        }

        // Real validation: inspect the actual file bytes ("magic numbers") so a
        // renamed non-image file (e.g. an HTML/SVG file with an embedded script,
        // or an executable) is rejected regardless of its filename.
        if (!hasValidImageSignature(file)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le contenu du fichier n'est pas une image valide");
        }

        String url;
        try {
            url = cloudinaryService.upload(file);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
        return new UploadResponse(url);
    }

    private boolean isImageFile(String filename) {
        String ext = getFileExtension(filename).toLowerCase();
        return ext.matches("\\.(jpg|jpeg|png|gif|webp)$");
    }

    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot) : "";
    }

    /** Checks the first bytes of the file against known image format signatures. */
    private boolean hasValidImageSignature(MultipartFile file) {
        byte[] header = new byte[12];
        try (InputStream in = file.getInputStream()) {
            int read = in.read(header);
            if (read < 4) return false;
        } catch (IOException e) {
            return false;
        }

        // JPEG: FF D8 FF
        boolean jpeg = (header[0] & 0xFF) == 0xFF && (header[1] & 0xFF) == 0xD8 && (header[2] & 0xFF) == 0xFF;
        // PNG: 89 50 4E 47
        boolean png = (header[0] & 0xFF) == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47;
        // GIF: 47 49 46 38
        boolean gif = header[0] == 0x47 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x38;
        // WEBP: "RIFF"...."WEBP"
        boolean webp = header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46
            && header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50;

        return jpeg || png || gif || webp;
    }

    public record UploadResponse(String url) {}
}
