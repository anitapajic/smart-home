package com.example.smarthome.controller;

import jakarta.websocket.server.PathParam;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@CrossOrigin(value="*")
@RestController
@RequestMapping(value = "/images/")
public class SaveImageController {

    private static final String IMAGE_STORAGE_PATH = "images/";

    @PostMapping("upload/{folder}")
    public ResponseEntity<String> handleFileUpload(@PathVariable String folder, @RequestParam("file") MultipartFile file) {
        try {
            System.out.println("usao u try");
            if (file.isEmpty()) {
                System.out.println("file is empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
            }
            String folderPath = IMAGE_STORAGE_PATH+folder+'/';
            System.out.println("folder path: " + folderPath);
            String filename = file.getOriginalFilename();
            Path destinationFile = Paths.get(folderPath).resolve(Paths.get(filename)).normalize().toAbsolutePath();

            if (!destinationFile.getParent().equals(Paths.get(folderPath).toAbsolutePath())) {
                // Security check
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot store file outside current directory.");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            return ResponseEntity.ok("File uploaded successfully: " + filename);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not upload the file: " + file.getOriginalFilename());
        }
    }


}
