package com.spidosoft.erp.common;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

/**
 * Zero-based page request bound from query parameters ({@code ?page=0&size=50}).
 *
 * @param page zero-based page index (default 0)
 * @param size page size, 1–{@value #MAX_SIZE} (default {@value #DEFAULT_SIZE})
 */
public record PageQuery(
        @Schema(description = "Zero-based page index", defaultValue = "0") @Min(0) Integer page,
        @Schema(description = "Page size", defaultValue = "50") @Min(1) @Max(MAX_SIZE) Integer size) {

    public static final int DEFAULT_SIZE = 50;
    public static final int MAX_SIZE = 100;

    public PageQuery {
        page = page == null ? 0 : page;
        size = size == null ? DEFAULT_SIZE : size;
    }
}
