package com.spidosoft.erp.application;

/**
 * @param status   application status, always "UP" when this endpoint answers
 * @param database "NOT_CONFIGURED" (profile nodb), "UP" or "DOWN" (profile db, validated connection)
 */
public record SystemHealthResponse(String status, String database) {
}
