# ===============================
# 1️⃣ Build Stage
# ===============================
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy pom.xml first to leverage caching
COPY pom.xml .
# Download dependencies (reduces future build times)
RUN mvn dependency:go-offline -B

# Copy entire project
COPY src ./src

# Build the Spring Boot jar
RUN mvn clean package -DskipTests

# ===============================
# 2️⃣ Runtime Stage
# ===============================
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy built jar from builder stage
COPY --from=build /workspace/target/*.jar app.jar

# Environment optimization for DigitalOcean
ENV JAVA_OPTS="-Xms128m -Xmx512m -XX:+UseContainerSupport -Dserver.port=8080"

# Expose port for App Platform
EXPOSE 8080

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
