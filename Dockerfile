# --- Build stage ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN mvn -B dependency:go-offline || true
COPY src ./src
RUN mvn -B clean package -DskipTests

# --- Run stage ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# H2 file DB lives here; Render's free disk is ephemeral across deploys,
# but the DataSeeder repopulates demo data automatically on startup.
RUN mkdir -p /app/data
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
