package com.room_chat.app.chat_app.controllers;

import com.room_chat.app.chat_app.entities.Message;
import com.room_chat.app.chat_app.entities.Room;
import com.room_chat.app.chat_app.payloads.MessageRequest;
import com.room_chat.app.chat_app.services.MessageService;
import com.room_chat.app.chat_app.services.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin
public class RoomController {
    private final RoomService roomService;
    private final MessageService messageService;

    public RoomController(RoomService roomService, MessageService messageService) {
        this.roomService = roomService;
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId) {
        String normalizedRoomId = normalizeRoomId(roomId);
        if (normalizedRoomId == null) {
            return ResponseEntity.badRequest().body("roomId is required.");
        }

        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(roomService.createRoom(normalizedRoomId));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    private static String normalizeRoomId(String raw) {
        if (raw == null) return null;
        String s = raw.trim();
        if (s.isEmpty()) return null;
        if (s.length() >= 2 && s.startsWith("\"") && s.endsWith("\"")) {
            s = s.substring(1, s.length() - 1).trim();
        }
        return s.isEmpty() ? null : s;
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable String roomId) {
        try {
            return ResponseEntity.ok(roomService.getRoom(roomId));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<?> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "20", required = false) int size
    ) {
        try {
            return ResponseEntity.ok(messageService.getMessages(roomId, page, size));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/{roomId}/messages")
    public ResponseEntity<?> sendMessage(@PathVariable String roomId, @Valid @RequestBody MessageRequest request) {
        try {
            return ResponseEntity.ok(messageService.sendMessage(roomId, request));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
