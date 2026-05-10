package com.room_chat.app.chat_app.services;

import com.room_chat.app.chat_app.entities.Message;
import com.room_chat.app.chat_app.payloads.MessageRequest;

import java.util.List;

public interface MessageService {
    Message sendMessage(String roomId, MessageRequest request);
    List<Message> getMessages(String roomId, int page, int size);
}
