package com.spidosoft.erp.customer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Minimal row for the mapping "Select Code / Select Name" controls when "Is Customer" is selected
 * (docs/07 §1, PROPOSED). Whether mappings reference {@code Id} or {@code CustCode} is TBD (C8).
 */
public record CustomerOptionResponse(
        @JsonProperty("Id") Integer id,
        @JsonProperty("CustCode") String custCode,
        @JsonProperty("CustName") String custName) {
}
