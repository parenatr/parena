# ============================================================
# Generic MULTI-STAGE Dockerfile for ANY PARENA backend module.
# Build context must be the `backend/` directory.
# (docker-compose passes MODULE per service.)
# ============================================================
ARG MODULE
# ---------- Stage 1: build ----------
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
ARG MODULE
WORKDIR /build

# Parent POM first for better layer caching.
COPY pom.xml ./pom.xml

# copy service module
COPY ${MODULE}/pom.xml ./${MODULE}/pom.xml
COPY ${MODULE}/src ./${MODULE}/src

# Build the application
WORKDIR /build/${MODULE}
RUN mvn -B package -DskipTests

# Extract Spring Boot layers for cache-friendly runtime image.
WORKDIR /build/${MODULE}/target
RUN sh -c 'java -Djarmode=layertools -jar *.jar extract'

# ---------- Stage 2: runtime ----------
FROM eclipse-temurin:21-jre-alpine AS runtime
ARG MODULE
LABEL maintainer="parena-team"
LABEL module="${MODULE}"
LABEL org.opencontainers.image.title="${MODULE}"
LABEL org.opencontainers.image.vendor="Parena"

#Güvenlik için non-root user
RUN addgroup -S spring && adduser -S spring -G spring

# Çalışma klasörü
WORKDIR /app

# Layered jar extract ettiğimiz klasmanları kopyalayacagız
COPY --from=builder --chown=spring:spring /build/${MODULE}/target/dependencies/ ./
COPY --from=builder --chown=spring:spring /build/${MODULE}/target/spring-boot-loader/ ./
COPY --from=builder --chown=spring:spring /build/${MODULE}/target/snapshot-dependencies/ ./
COPY --from=builder --chown=spring:spring /build/${MODULE}/target/application/ ./

# Switch to non-root user
USER spring:spring

# JVM Opts (container için en iyi ayarlar)
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:InitialRAMPercentage=50.0 \
               -XX:+ExitOnOutOfMemoryError \
               -Djava.security.egd=file:/dev/./urandom"

# ENTRYPOINT (JarLauncher ile çalışıyor.)
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]