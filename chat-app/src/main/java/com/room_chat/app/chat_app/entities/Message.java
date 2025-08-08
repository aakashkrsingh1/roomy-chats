package com.room_chat.app.chat_app.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Message {

    private String sender;
    private String content;
    private LocalDateTime timeStamp;
    private String messageType; // TEXT, IMAGE, PDF, FILE
    private Attachment attachment; // optional

    public Message(String sender, String content) {
        this.sender = sender;
        this.content = content;
        this.timeStamp= LocalDateTime.now();
        this.messageType = "TEXT";
    }
}
