package com.room_chat.app.chat_app.services;

import com.room_chat.app.chat_app.dtos.auth.RegisterRequest;
import com.room_chat.app.chat_app.entities.User;

public interface UserService {
    User register(RegisterRequest request);
}
