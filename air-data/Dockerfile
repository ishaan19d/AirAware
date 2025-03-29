FROM eclipse-temurin:23-jdk AS build

WORKDIR /app

# Copy gradle configuration files first and download dependencies
# This layer will be cached unless build.gradle changes
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Run a task that forces gradle to download dependencies
RUN chmod +x ./gradlew && \
    ./gradlew dependencies --no-daemon > /dev/null

# Now copy source code
COPY src src
COPY .env .env

# Build the application
RUN ./gradlew bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:23-jre

WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /app/build/libs/*.jar app.jar
# Copy the .env file to the runtime image
COPY --from=build /app/.env .env

EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]