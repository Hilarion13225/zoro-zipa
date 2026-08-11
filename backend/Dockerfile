# Multi-stage build
FROM maven:3.9.4-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:resolve
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

# Create directories for data and uploads
RUN mkdir -p /app/data /app/uploads

# Copy built JAR from builder
COPY --from=builder /app/target/*.jar app.jar

# Environment variables
ENV APP_FILE_STORAGE_UPLOAD_DIR=/app/uploads
ENV SERVER_PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
