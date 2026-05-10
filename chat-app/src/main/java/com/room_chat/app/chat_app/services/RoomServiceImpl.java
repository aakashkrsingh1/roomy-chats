package com.room_chat.app.chat_app.services;

import com.room_chat.app.chat_app.entities.Message;
import com.room_chat.app.chat_app.entities.Room;
import com.room_chat.app.chat_app.payloads.MessageRequest;
import com.room_chat.app.chat_app.repositories.RoomRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    @CacheEvict(value = "rooms", allEntries = true)
    public Room createRoom(String roomId) {
        if (roomRepository.findByRoomId(roomId) != null) {
            throw new IllegalArgumentException("Room already exists");
        }

        Room room = new Room();
        room.setRoomId(roomId);
        try {
            return roomRepository.save(room);
        } catch (DuplicateKeyException ex) {
            throw new IllegalArgumentException("Room already exists");
        }
    }

    @Override
    @Cacheable(value = "rooms", key = "#roomId")
    public Room getRoom(String roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            throw new IllegalArgumentException("Room not found");
        }
        return room;
    }

    @Override
    @Cacheable(value = "messages", key = "#roomId + '_' + #page + '_' + #size")
    public List<Message> getMessages(String roomId, int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("page must be greater than or equal to 0");
        }
        if (size <= 0) {
            throw new IllegalArgumentException("size must be greater than 0");
        }

        Room room = getRoom(roomId);
        List<Message> messages = room.getMessages();
        int start = Math.max(0, messages.size() - (page + 1) * size);
        int end = Math.min(messages.size(), start + size);
        return new ArrayList<>(messages.subList(start, end));
    }

    @Override
    @CacheEvict(value = {"messages", "rooms"}, allEntries = true)
    public Message sendMessage(String roomId, MessageRequest request) {
        Room room = getRoom(roomId);
        Message message = new Message();
        message.setSender(request.getSender());
        message.setContent(request.getContent());
        message.setTimeStamp(request.getTimeStamp() != null ? request.getTimeStamp() : java.time.LocalDateTime.now());
        message.setMessageType(request.getMessageType() == null || request.getMessageType().isBlank() ? "TEXT" : request.getMessageType());
        message.setAttachment(request.getAttachment());

        room.getMessages().add(message);
        roomRepository.save(room);
        return message;
    }
}
