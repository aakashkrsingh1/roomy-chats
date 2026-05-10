package com.room_chat.app.chat_app.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI roomyChatOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Roomy Chats API")
                        .version("1.0")
                        .description("Chat backend for rooms, messages, and authenticated users")
                        .license(new License().name("MIT").url("https://opensource.org/licenses/MIT")))
                .externalDocs(new ExternalDocumentation()
                        .description("Roomy Chats docs")
                        .url("https://github.com/your-repo/roomy-chats"));
    }
}
