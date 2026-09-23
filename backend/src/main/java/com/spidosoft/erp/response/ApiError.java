package com.spidosoft.erp.response;

import java.util.List;

/**
 * Error body carried by {@link ApiResponse} when {@code success == false}.
 *
 * @param code       stable machine-readable code (see {@code ErrorCode})
 * @param message    human-readable summary, safe to show to users
 * @param violations field-level validation failures (empty when not applicable)
 * @param path       request path
 * @param requestId  correlation id, also returned in the {@code X-Request-Id} header
 */
public record ApiError(String code, String message, List<FieldViolation> violations, String path, String requestId) {

    public ApiError {
        violations = violations == null ? List.of() : List.copyOf(violations);
    }
}
