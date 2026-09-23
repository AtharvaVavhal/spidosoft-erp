package com.spidosoft.erp.application;

/**
 * @param name              application name
 * @param version           application version ("dev" when build info is unavailable)
 * @param buildTime         ISO-8601 build time, or null when run without Maven build info
 * @param javaVersion       runtime Java version
 * @param springBootVersion Spring Boot version
 */
public record SystemVersionResponse(String name, String version, String buildTime, String javaVersion,
                                    String springBootVersion) {
}
