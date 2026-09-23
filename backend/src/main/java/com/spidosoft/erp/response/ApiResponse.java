package com.spidosoft.erp.response;

import java.time.Instant;

/**
 * Uniform envelope for every JSON response of the ERP API.
 *
 * <pre>
 * { "success": true,  "data": {...}, "error": null,  "timestamp": "..." }
 * { "success": false, "data": null,  "error": {...}, "timestamp": "..." }
 * </pre>
 */
public record ApiResponse<T>(boolean success, T data, ApiError error, Instant timestamp) {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, Instant.now());
    }

    public static <T> ApiResponse<T> failure(ApiError error) {
        return new ApiResponse<>(false, null, error, Instant.now());
    }
}
