package com.spidosoft.erp.customer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.spidosoft.erp.common.Tbd;
import java.time.LocalDateTime;

/** Read model of one {@code dbo.CustomerMaster} row; JSON names mirror the 28 confirmed columns exactly. */
public record CustomerResponse(
        @JsonProperty("Id") Integer id,                         // int NOT NULL, PK
        @JsonProperty("CustCode") String custCode,              // varchar(max) NULL — uniqueness TBD, C8
        @JsonProperty("CustName") String custName,              // varchar(max) NULL — not unique (INFERRED), C9
        @JsonProperty("ContactPerson") String contactPerson,
        @JsonProperty("Branch") String branch,                  // text vs BranchId, C4
        @JsonProperty("Address1") String address1,
        @JsonProperty("Address2") String address2,
        @JsonProperty("City") String city,                      // text vs CityId, C4
        @JsonProperty("State") String state,                    // text vs StateId, C4
        @JsonProperty("PinCode") String pinCode,                // varchar(20)
        @JsonProperty("Country") String country,                // text vs CountryId, C4
        @JsonProperty("EmailID") String emailId,
        @JsonProperty("Telephone") String telephone,            // varchar(20)
        @JsonProperty("Mobile") String mobile,                  // varchar(20)
        @JsonProperty("Fax") String fax,
        @JsonProperty("Website") String website,
        @JsonProperty("GSTIN") String gstin,
        @JsonProperty("Remarks") String remarks,
        @JsonProperty("Username") String username,              // audit, §9-9
        @JsonProperty("LoginBranch") String loginBranch,        // audit, §9-9
        @Tbd(value = "time zone; entry vs modified", ref = "C13")
        @JsonProperty("SystEmentryDate") LocalDateTime systEntryDate,
        // TBD — pending Spidosoft confirmation: FK target tables are not shown (decision 8)
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("CustomerTypeId") Integer customerTypeId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("CityId") Integer cityId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("StateId") Integer stateId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("CountryId") Integer countryId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("BranchId") Integer branchId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("LoginUserId") Integer loginUserId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("ConsigneeId") Integer consigneeId) {
}
