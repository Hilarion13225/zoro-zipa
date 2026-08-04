# --- Frontend build stage: builds the React app so pom.xml can embed it ---
FROM node:22-alpine AS frontend-build
WORKDIR /app/zoro-zipa-web
COPY zoro-zipa-web/package.json zoro-zipa-web/package-lock.json ./
RUN npm install
COPY zoro-zipa-web/ ./
RUN npm run build

# --- Backend build stage ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# pom.xml's package phase shells out to "npm run build" and then copies
# zoro-zipa-web/dist into the jar. The frontend is already built above,
# so this fake npm just needs to succeed without redoing the work.
RUN printf '#!/bin/sh\nexit 0\n' > /usr/local/bin/npm && chmod +x /usr/local/bin/npm

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN mvn -B dependency:go-offline || true
COPY src ./src
COPY zoro-zipa-web/package.json zoro-zipa-web/package-lock.json ./zoro-zipa-web/
COPY --from=frontend-build /app/zoro-zipa-web/dist ./zoro-zipa-web/dist
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
