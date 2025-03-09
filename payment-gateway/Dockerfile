# /payment-gateway/Dockerfile
FROM eclipse-temurin:23-jdk AS build

WORKDIR /app

# Copy gradle files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
COPY .env .env

# Make gradlew executable
RUN chmod +x ./gradlew

# Build the application
RUN ./gradlew bootJar

# Runtime stage
FROM eclipse-temurin:23-jre

WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /app/build/libs/*.jar app.jar
# Copy the .env file to the runtime image
COPY --from=build /app/.env .env

EXPOSE 8082

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]