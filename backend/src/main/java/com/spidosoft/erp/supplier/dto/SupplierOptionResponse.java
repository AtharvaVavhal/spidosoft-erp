package com.spidosoft.erp.supplier.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Minimal row for the mapping "Select Code / Select Name" controls when "Is Supplier" is selected
 * (docs/07 §1, PROPOSED). Whether mappings reference {@code Id} or {@code SuppCode} is TBD (C8).
 */
public record SupplierOptionResponse(
        @JsonProperty("Id") Integer id,
        @JsonProperty("SuppCode") String suppCode,
        @JsonProperty("SuppName") String suppName) {
}
