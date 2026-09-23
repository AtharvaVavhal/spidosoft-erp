package com.spidosoft.erp.exception;

import org.springframework.http.HttpStatus;

/** Stable error codes returned in {@code ApiError.code}. Never rename an existing constant. */
public enum ErrorCode {

    VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "One or more fields are invalid."),
    MALFORMED_REQUEST(HttpStatus.BAD_REQUEST, "The request body could not be read."),
    MISSING_PARAMETER(HttpStatus.BAD_REQUEST, "A required request parameter is missing."),
    TYPE_MISMATCH(HttpStatus.BAD_REQUEST, "A request parameter has the wrong type."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "The requested resource was not found."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "This HTTP method is not supported for this resource."),
    UNSUPPORTED_MEDIA_TYPE(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "This content type is not supported."),
    CONFLICT(HttpStatus.CONFLICT, "The request conflicts with the current state of the resource."),
    /** The operation depends on an open Spidosoft decision (docs/10) and is intentionally not implemented. */
    PENDING_CONFIRMATION(HttpStatus.NOT_IMPLEMENTED, "This operation is pending Spidosoft confirmation."),
    /** No database is configured (profile "nodb"). */
    PERSISTENCE_NOT_CONFIGURED(HttpStatus.SERVICE_UNAVAILABLE, "No database is configured for this environment."),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.");

    private final HttpStatus status;
    private final String defaultMessage;

    ErrorCode(HttpStatus status, String defaultMessage) {
        this.status = status;
        this.defaultMessage = defaultMessage;
    }

    public HttpStatus status() {
        return status;
    }

    public String defaultMessage() {
        return defaultMessage;
    }
}
