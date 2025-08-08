package com.room_chat.app.chat_app.payloads;

import com.room_chat.app.chat_app.entities.Attachment;
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
private String content;
private String sender;
private  String roomId;
private String messageType; // TEXT, IMAGE, PDF, FILE
private Attachment attachment; // optional
}
