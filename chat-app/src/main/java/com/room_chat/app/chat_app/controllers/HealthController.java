package com.room_chat.app.chat_app.controllers;

import com.room_chat.app.chat_app.repositories.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/health")
@CrossOrigin
public class HealthController {

    private final RoomRepository roomRepository;

    public HealthController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        try {
            long roomCount = roomRepository.count();
            return ResponseEntity.ok(Map.of(
                    "status", "UP",
                    "database", "reachable",
                    "roomCount", roomCount
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                    "status", "DOWN",
                    "database", "unreachable",
                    "error", ex.getMessage()
            ));
        }
    }
}
