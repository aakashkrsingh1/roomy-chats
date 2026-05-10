package com.room_chat.app.chat_app.services;

import com.room_chat.app.chat_app.entities.Message;
import com.room_chat.app.chat_app.payloads.MessageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    private final RoomService roomService;

    public MessageServiceImpl(RoomService roomService) {
        this.roomService = roomService;
    }

    @Override
    public Message sendMessage(String roomId, MessageRequest request) {
        return roomService.sendMessage(roomId, request);
    }

    @Override
    public List<Message> getMessages(String roomId, int page, int size) {
        return roomService.getMessages(roomId, page, size);
    }
}
