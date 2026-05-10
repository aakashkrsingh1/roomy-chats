package com.room_chat.app.chat_app;

import com.room_chat.app.chat_app.dtos.auth.AuthRequest;
import com.room_chat.app.chat_app.dtos.auth.AuthResponse;
import com.room_chat.app.chat_app.dtos.auth.RegisterRequest;
import com.room_chat.app.chat_app.payloads.MessageRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.room_chat.app.chat_app.repositories.RoomRepository;
import com.room_chat.app.chat_app.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ConcurrentMultiUserTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanDatabase() {
        roomRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void shouldHandleMultipleUsersInMultipleRoomsConcurrently() throws Exception {
        int numUsers = 5;
        int numRooms = 3;
        String roomPrefix = "concurrent-room-";
        AtomicInteger successCount = new AtomicInteger(0);

        AuthResponse setupAuth = registerAndLogin("setup-user");
        for (int r = 1; r <= numRooms; r++) {
            mockMvc.perform(post("/api/v1/rooms")
                    .contentType(MediaType.TEXT_PLAIN)
                    .content(roomPrefix + r)
                    .header("Authorization", setupAuth.getTokenType() + " " + setupAuth.getToken()))
                    .andExpect(status().isCreated());
        }

        ExecutorService executor = Executors.newFixedThreadPool(numUsers);

        for (int u = 1; u <= numUsers; u++) {
            final int userId = u;
            executor.submit(() -> {
                try {
                    String username = "user" + userId;
                    AuthResponse authResponse = registerAndLogin(username);

                    for (int r = 1; r <= numRooms; r++) {
                        String roomId = roomPrefix + r;

                        MessageRequest msgRequest = new MessageRequest();
                        msgRequest.setContent("Message from user " + userId + " in room " + r);
                        msgRequest.setSender(username);
                        msgRequest.setRoomId(roomId);

                        mockMvc.perform(post("/api/v1/rooms/" + roomId + "/messages")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(msgRequest))
                                .header("Authorization", authResponse.getTokenType() + " " + authResponse.getToken()))
                                .andExpect(status().isOk());

                        mockMvc.perform(get("/api/v1/rooms/" + roomId + "/messages")
                                .header("Authorization", authResponse.getTokenType() + " " + authResponse.getToken()))
                                .andExpect(status().isOk());
                    }

                    successCount.incrementAndGet();
                } catch (Exception ex) {
                    System.err.println("Error in user " + userId + ": " + ex.getMessage());
                }
            });
        }

        executor.shutdown();
        boolean completed = executor.awaitTermination(30, TimeUnit.SECONDS);
        assertThat(completed).isTrue();
        assertThat(successCount.get()).isEqualTo(numUsers);
    }

    private AuthResponse registerAndLogin(String username) throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername(username);
        registerRequest.setPassword("Password123");

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        AuthRequest authRequest = new AuthRequest();
        authRequest.setUsername(username);
        authRequest.setPassword("Password123");

        String loginJson = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        return objectMapper.readValue(loginJson, AuthResponse.class);
    }
}
