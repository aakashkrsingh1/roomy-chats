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

    public Message(String sender, String content) {
        this.sender = sender;
        this.content = content;
        this.timeStamp= LocalDateTime.now();
    }
}
