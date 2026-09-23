package com.spidosoft.erp.item.dto;

/**
 * Item list filter bound from query parameters.
 *
 * @param q free text matched against {@code ItemCode} and {@code ItemName}
 */
public record ItemSearchCriteria(String q) {
}
