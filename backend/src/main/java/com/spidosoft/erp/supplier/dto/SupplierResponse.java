package com.spidosoft.erp.supplier.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.spidosoft.erp.common.Tbd;
import java.time.LocalDateTime;

/** Read model of one {@code dbo.SupplierMaster} row; JSON names mirror the 27 confirmed columns exactly. */
public record SupplierResponse(
        @JsonProperty("Id") Integer id,                         // int NOT NULL, PK
        @JsonProperty("SuppCode") String suppCode,              // varchar(max) NULL — uniqueness TBD, C8
        @JsonProperty("SuppName") String suppName,
        @JsonProperty("ContactPerson") String contactPerson,
        @JsonProperty("Branch") String branch,
        @JsonProperty("Address1") String address1,
        @JsonProperty("Address2") String address2,
        @JsonProperty("City") String city,
        @JsonProperty("State") String state,
        @JsonProperty("PinCode") Long pinCode,                  // numeric(6,0) — C7
        @JsonProperty("Country") String country,
        @JsonProperty("EmailID") String emailId,
        // numeric(18,0): up to 18 digits exceeds JavaScript's safe-integer range (2^53 − 1, 16 digits), so it
        // travels as a JSON string of digits. The column type is unchanged (docs/07 §0, C7).
        @JsonProperty("Telephone") @JsonFormat(shape = JsonFormat.Shape.STRING) Long telephone,
        @JsonProperty("Mobile") Long mobile,                    // numeric(10,0) — C7
        @JsonProperty("Fax") String fax,
        @JsonProperty("Website") String website,
        @JsonProperty("GSTIN") String gstin,
        @JsonProperty("Remarks") String remarks,
        @JsonProperty("Username") String username,              // audit, §9-9
        @JsonProperty("LoginBranch") String loginBranch,        // audit, §9-9
        @Tbd(value = "time zone; entry vs modified", ref = "C13")
        @JsonProperty("SystEmentryDate") LocalDateTime systEntryDate,
        // TBD — pending Spidosoft confirmation: not marked FK in the schema; reference target unknown (C5, C6)
        @Tbd(value = "FK or plain int?", ref = "C6") @JsonProperty("supptypeid") Integer suppTypeId,
        @Tbd(value = "FK or plain int?", ref = "C5") @JsonProperty("CountryId") Integer countryId,
        @Tbd(value = "FK or plain int?", ref = "C5") @JsonProperty("StateId") Integer stateId,
        @Tbd(value = "FK or plain int?", ref = "C5") @JsonProperty("CityId") Integer cityId,
        @Tbd(value = "FK or plain int?", ref = "C5") @JsonProperty("BranchId") Integer branchId,
        @Tbd(value = "FK or plain int?", ref = "C5") @JsonProperty("LoginUserId") Integer loginUserId) {
}
