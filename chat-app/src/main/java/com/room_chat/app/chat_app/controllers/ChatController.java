package com.room_chat.app.chat_app.controllers;


import com.room_chat.app.chat_app.entities.Message;
import com.room_chat.app.chat_app.payloads.MessageRequest;
import com.room_chat.app.chat_app.services.MessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

/*
Chat Concepts:

 */
@Controller
public class ChatController {

    private final MessageService messageService;

    public ChatController(MessageService messageService) {
        this.messageService = messageService;
    }

    //for sending and receiving messages

    @MessageMapping("/sendMessage/{roomId}") // app/sendMessage/roomId
    @SendTo("/topic/room/{roomId}") //subscribe
    public Message sendMessage(
            @DestinationVariable String roomId,
            @RequestBody MessageRequest request
    ){
        return messageService.sendMessage(roomId, request);
    }
}
