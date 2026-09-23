package com.spidosoft.erp.customer.dto;

import static com.spidosoft.erp.validation.ColumnLimits.CUSTOMER_MOBILE_LENGTH;
import static com.spidosoft.erp.validation.ColumnLimits.CUSTOMER_PIN_CODE_LENGTH;
import static com.spidosoft.erp.validation.ColumnLimits.CUSTOMER_TELEPHONE_LENGTH;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.spidosoft.erp.common.Tbd;
import jakarta.validation.constraints.Size;

/**
 * Write model for {@code dbo.CustomerMaster}. Not used by any endpoint yet: Customer create/edit is outside
 * the supplied requirement (docs/10 §11). Constraints are confirmed column limits only; no field is required
 * because business-required fields are TBD (§9-7). Every column besides {@code Id} is nullable in the schema.
 *
 * <p>Excluded: {@code Id} (identity TBD) and audit/scoping columns {@code Username}, {@code LoginBranch},
 * {@code SystEmentryDate}, {@code BranchId}, {@code LoginUserId} (§9-9).
 */
@Tbd(value = "Customer create/edit scope", ref = "§11")
public record CustomerRequest(
        @Tbd(value = "mandatory? unique? generated?", ref = "C8") @JsonProperty("CustCode") String custCode,
        @JsonProperty("CustName") String custName,
        @JsonProperty("ContactPerson") String contactPerson,
        @JsonProperty("Branch") String branch,
        @JsonProperty("Address1") String address1,
        @JsonProperty("Address2") String address2,
        @JsonProperty("City") String city,
        @JsonProperty("State") String state,
        @JsonProperty("PinCode") @Size(max = CUSTOMER_PIN_CODE_LENGTH) String pinCode,
        @JsonProperty("Country") String country,
        @JsonProperty("EmailID") String emailId,
        @JsonProperty("Telephone") @Size(max = CUSTOMER_TELEPHONE_LENGTH) String telephone,
        @JsonProperty("Mobile") @Size(max = CUSTOMER_MOBILE_LENGTH) String mobile,
        @JsonProperty("Fax") String fax,
        @JsonProperty("Website") String website,
        @JsonProperty("GSTIN") String gstin,
        @JsonProperty("Remarks") String remarks,
        // TBD — pending Spidosoft confirmation: FK target tables are not shown (decision 8)
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("CustomerTypeId") Integer customerTypeId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("CityId") Integer cityId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("StateId") Integer stateId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("CountryId") Integer countryId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("ConsigneeId") Integer consigneeId) {
}
