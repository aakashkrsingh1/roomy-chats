package com.room_chat.app.chat_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat") //connection establishment
                .setAllowedOrigins(AppConstants.FRONTEND_BASE_URL)
                .withSockJS();

    }
    //chat endpoint is where the client establishes the connection
    //sockJs gives the fallback for websocket

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        //MessageBroker helps to route messages.
        config.enableSimpleBroker("/topic");
        //Whatever messages come to the server will be published to this prefix.
        //
        config.setApplicationDestinationPrefixes("/app");
        //if Client sneds  /app/chat
    }
}
