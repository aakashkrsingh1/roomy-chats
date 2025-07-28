# --- Stage 1: Build the JAR ---
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /build
COPY . .
RUN mvn clean package -DskipTests

# --- Stage 2: Run the JAR ---
FROM openjdk:21-jdk-slim

WORKDIR /app
COPY --from=builder /build/target/chat-app-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
