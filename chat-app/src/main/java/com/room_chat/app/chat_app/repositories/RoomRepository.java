package com.room_chat.app.chat_app.repositories;

import com.room_chat.app.chat_app.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room, String> {

    //get room using room id
    Room findByRoomId (String roomId);

}
