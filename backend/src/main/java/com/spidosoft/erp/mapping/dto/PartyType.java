package com.spidosoft.erp.mapping.dto;

/**
 * The party kind chosen with the confirmed "Is Supplier" / "Is Customer" radio buttons (docs/02 R-4).
 * Whether one Item may be mapped to both kinds is TBD (docs/10 C10).
 */
public enum PartyType {
    SUPPLIER,
    CUSTOMER
}
