package com.vitrinezoro.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.nio.file.Paths;

@Component
@ConfigurationProperties(prefix = "app.file-storage")
public class FileStorageConfig {

    private String uploadDir = "uploads";

    public String getUploadDir() {
        return Paths.get(uploadDir).toAbsolutePath().toString();
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public String getUploadUrl(String filename) {
        return "/uploads/" + filename;
    }
}
