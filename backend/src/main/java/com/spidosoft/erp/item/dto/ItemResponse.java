package com.spidosoft.erp.item.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.spidosoft.erp.common.Tbd;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Read model of one {@code dbo.ItemMaster} row. JSON names mirror the column names exactly (docs/07),
 * including source spellings such as {@code HSNCODE} and {@code SystEmentryDate}. All 25 confirmed columns
 * are present; no column is added.
 */
public record ItemResponse(
        @JsonProperty("ID") Integer id,                                   // int NOT NULL, PK
        @JsonProperty("ItemCode") String itemCode,                        // varchar(255) NOT NULL, PK
        @JsonProperty("ItemName") String itemName,                        // varchar(max) NULL
        @JsonProperty("Material") String material,                        // varchar(max) NULL
        @JsonProperty("ItemType") String itemType,                        // varchar(max) NULL
        @JsonProperty("ItemSubType") String itemSubType,                  // varchar(max) NULL
        @JsonProperty("Color") String color,                              // varchar(max) NULL — vs ColourId, C4
        @JsonProperty("UOM") String uom,                                  // varchar(255) NULL — vs UnitId, C4
        @JsonProperty("HSNCODE") String hsnCode,                          // varchar(255) NULL
        @JsonProperty("GSTRate") BigDecimal gstRate,                      // decimal(20,2) NULL
        @JsonProperty("PurchaseCost") BigDecimal purchaseCost,            // decimal(20,2) NULL
        @JsonProperty("SellingPrice") BigDecimal sellingPrice,            // decimal(20,2) NULL
        @JsonProperty("Username") String username,                        // varchar(max) NULL — audit, §9-9
        @JsonProperty("LoginBranch") String loginBranch,                  // varchar(max) NULL — audit, §9-9
        // TBD — pending Spidosoft confirmation: time zone and entry-vs-modified semantics (C13)
        @Tbd(value = "datetime without time zone; entry vs modified", ref = "C13")
        @JsonProperty("SystEmentryDate") LocalDateTime systEntryDate,     // datetime NULL
        @JsonProperty("RawMaterial") String rawMaterial,                  // varchar(50) NULL — meaning vs Material, C2
        // TBD — pending Spidosoft confirmation: FK target tables are not shown (decision 8)
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("SubCategoryId") Integer subCategoryId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("ManufacturerId") Integer manufacturerId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("ColourId") Integer colourId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("UnitId") Integer unitId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("UserId") Integer userId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("BranchId") Integer branchId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("CategoryId") Integer categoryId,
        @JsonProperty("DrawingNo") String drawingNo,                      // varchar(50) NULL
        @JsonProperty("Specification") String specification) {           // varchar(500) NULL
}
