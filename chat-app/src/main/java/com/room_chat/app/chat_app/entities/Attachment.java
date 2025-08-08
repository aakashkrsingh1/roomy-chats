package com.room_chat.app.chat_app.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {
    private String url;
    private String fileName;
    private String contentType;
    private long sizeBytes;
}
