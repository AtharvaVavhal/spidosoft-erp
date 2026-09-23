package com.spidosoft.erp.response;

/**
 * A single validation failure. Rejected values are intentionally not echoed back.
 *
 * @param field   request field (JSON name) or parameter name; empty for object-level errors
 * @param message human-readable message
 */
public record FieldViolation(String field, String message) {
}
