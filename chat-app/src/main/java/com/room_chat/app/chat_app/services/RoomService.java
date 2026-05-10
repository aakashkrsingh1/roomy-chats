package com.room_chat.app.chat_app.services;

import com.room_chat.app.chat_app.entities.Message;
import com.room_chat.app.chat_app.entities.Room;
import com.room_chat.app.chat_app.payloads.MessageRequest;

import java.util.List;

public interface RoomService {
    Room createRoom(String roomId);
    Room getRoom(String roomId);
    List<Message> getMessages(String roomId, int page, int size);
    Message sendMessage(String roomId, MessageRequest request);
}
