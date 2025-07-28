package com.room_chat.app.chat_app.controllers;


import com.room_chat.app.chat_app.entities.Message;
import com.room_chat.app.chat_app.entities.Room;
import com.room_chat.app.chat_app.payloads.MessageRequest;
import com.room_chat.app.chat_app.repositories.RoomRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

/*
Chat Concepts:

 */
@Controller
public class ChatController {


    private RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    //for sending and receiving messages

    @MessageMapping("/sendMessage/{roomId}") // app/sendMessage/roomId
    @SendTo("/topic/room/{roomId}") //subscribe
    public Message sendMessage(
            @DestinationVariable String roomId,
            @RequestBody MessageRequest request
    ){
        Room room = roomRepository.findByRoomId(request.getRoomId());
        Message message= new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());

        if(room!=null)
        {
            room.getMessages().add(message);
            roomRepository.save(room);
        }else{
            throw new RuntimeException("room not found!");
        }
        return  message;
    }
}
