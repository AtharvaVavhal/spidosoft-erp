package com.spidosoft.erp.supplier.dto;

import static com.spidosoft.erp.validation.ColumnLimits.SUPPLIER_MOBILE_DIGITS;
import static com.spidosoft.erp.validation.ColumnLimits.SUPPLIER_PIN_CODE_DIGITS;
import static com.spidosoft.erp.validation.ColumnLimits.SUPPLIER_TELEPHONE_DIGITS;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.spidosoft.erp.common.Tbd;
import jakarta.validation.constraints.Digits;

/**
 * Write model for {@code dbo.SupplierMaster}. Not used by any endpoint yet (docs/10 §11). Constraints are the
 * confirmed numeric precisions only; nothing is required (§9-7).
 *
 * <p>Excluded: {@code Id} and audit/scoping columns {@code Username}, {@code LoginBranch},
 * {@code SystEmentryDate}, {@code BranchId}, {@code LoginUserId} (§9-9).
 */
@Tbd(value = "Supplier create/edit scope", ref = "§11")
public record SupplierRequest(
        @Tbd(value = "mandatory? unique? generated?", ref = "C8") @JsonProperty("SuppCode") String suppCode,
        @JsonProperty("SuppName") String suppName,
        @JsonProperty("ContactPerson") String contactPerson,
        @JsonProperty("Branch") String branch,
        @JsonProperty("Address1") String address1,
        @JsonProperty("Address2") String address2,
        @JsonProperty("City") String city,
        @JsonProperty("State") String state,
        @JsonProperty("PinCode") @Digits(integer = SUPPLIER_PIN_CODE_DIGITS, fraction = 0) Long pinCode,
        @JsonProperty("Country") String country,
        @JsonProperty("EmailID") String emailId,
        @JsonProperty("Telephone") @Digits(integer = SUPPLIER_TELEPHONE_DIGITS, fraction = 0) Long telephone,
        @JsonProperty("Mobile") @Digits(integer = SUPPLIER_MOBILE_DIGITS, fraction = 0) Long mobile,
        @JsonProperty("Fax") String fax,
        @JsonProperty("Website") String website,
        @JsonProperty("GSTIN") String gstin,
        @JsonProperty("Remarks") String remarks,
        @Tbd(value = "FK or plain int?", ref = "C6") @JsonProperty("supptypeid") Integer suppTypeId,
        @Tbd(value = "FK or plain int?", ref = "C5") @JsonProperty("CountryId") Integer countryId,
        @Tbd(value = "FK or plain int?", ref = "C5") @JsonProperty("StateId") Integer stateId,
        @Tbd(value = "FK or plain int?", ref = "C5") @JsonProperty("CityId") Integer cityId) {
}
