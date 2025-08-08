package com.room_chat.app.chat_app.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/uploads")
@CrossOrigin
public class UploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.base.url:http://localhost:8080}")
    private String appBaseUrl;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(@RequestPart("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Empty file");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = "";
        int extIndex = originalFileName.lastIndexOf('.');
        if (extIndex != -1) {
            extension = originalFileName.substring(extIndex);
        }

        String storedFileName = UUID.randomUUID() + extension;
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        Path target = uploadPath.resolve(storedFileName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String publicUrl = appBaseUrl + "/" + uploadDir + "/" + storedFileName;

        Map<String, Object> body = new HashMap<>();
        body.put("url", publicUrl);
        body.put("fileName", originalFileName);
        body.put("contentType", file.getContentType());
        body.put("sizeBytes", file.getSize());
        return ResponseEntity.ok(body);
    }
}