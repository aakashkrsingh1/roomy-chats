package com.room_chat.app.chat_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;
@SpringBootApplication
public class ChatAppApplication {

	public static void main(String[] args) {
		loadDotenv();
		SpringApplication.run(ChatAppApplication.class, args);
	}

	private static void loadDotenv() {
		try {
			Dotenv dotenv = Dotenv.configure()
					.directory(System.getProperty("user.dir"))  // Ensures it works both in IDE and command line
					.ignoreIfMissing()
					.load();

			dotenv.entries().forEach(entry -> {
				System.setProperty(entry.getKey(), entry.getValue());
			});

			

		} catch (Exception e) {
			System.out.println("⚠️ Could not load .env file: " + e.getMessage());
		}
	}
}
