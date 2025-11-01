
FROM maven:3.9.5-eclipse-temurin-17 AS builder
WORKDIR /app


COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .


RUN --mount=type=cache,target=/root/.m2 mvn dependency:go-offline


COPY src /app/src


RUN mvn package -DskipTests


FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/backend-mbc-0.0.1-SNAPSHOT.jar app.jar


EXPOSE 8080


ENTRYPOINT ["java", "-jar", "app.jar"]
