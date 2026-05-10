package com.room_chat.app.chat_app.payloads;

import com.room_chat.app.chat_app.entities.Attachment;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequest {
    @NotBlank(message = "content is required")
    private String content;

    @NotBlank(message = "sender is required")
    private String sender;

    @NotBlank(message = "roomId is required")
    private String roomId;

    private String messageType; // TEXT, IMAGE, PDF, FILE
    private Attachment attachment; // optional
    private LocalDateTime timeStamp;
}
