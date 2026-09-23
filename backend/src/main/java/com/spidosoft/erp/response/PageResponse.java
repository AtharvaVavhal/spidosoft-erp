package com.spidosoft.erp.response;

import java.util.List;

/**
 * Engine-neutral page of results.
 *
 * @param content       rows on this page
 * @param page          zero-based page index
 * @param size          requested page size
 * @param totalElements total rows across all pages
 * @param totalPages    total number of pages
 */
public record PageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) {

    public PageResponse {
        content = List.copyOf(content);
    }

    public static <T> PageResponse<T> of(List<T> content, int page, int size, long totalElements) {
        int totalPages = size == 0 ? 0 : (int) Math.ceil((double) totalElements / size);
        return new PageResponse<>(content, page, size, totalElements, totalPages);
    }
}
