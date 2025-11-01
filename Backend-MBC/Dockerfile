# ===============================
# 1️⃣ Build Stage
# ===============================
FROM maven:3.9.5-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy only the Maven files first to leverage Docker caching
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .

# Pre-download dependencies
RUN ./mvnw dependency:go-offline -B

# Now copy the actual source code
COPY src ./src

# Build the Spring Boot JAR
RUN ./mvnw clean package -DskipTests

# ===============================
# 2️⃣ Runtime Stage
# ===============================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR from builder
COPY --from=builder /app/target/backend-mbc-0.0.1-SNAPSHOT.jar app.jar

# Environment variables (DigitalOcean can override these)
ENV SERVER_PORT=8080
ENV DB_URL=localhost:3306/your_db
ENV DB_USERNAME=root
ENV DB_PASSWORD=SchoolProject@2023

# Expose Spring Boot port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java","-jar","app.jar"]
