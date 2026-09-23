package com.spidosoft.erp.item.dto;

import static com.spidosoft.erp.validation.ColumnLimits.DECIMAL_20_2_FRACTION;
import static com.spidosoft.erp.validation.ColumnLimits.DECIMAL_20_2_INTEGER;
import static com.spidosoft.erp.validation.ColumnLimits.ITEM_CODE_LENGTH;
import static com.spidosoft.erp.validation.ColumnLimits.ITEM_DRAWING_NO_LENGTH;
import static com.spidosoft.erp.validation.ColumnLimits.ITEM_HSNCODE_LENGTH;
import static com.spidosoft.erp.validation.ColumnLimits.ITEM_RAW_MATERIAL_LENGTH;
import static com.spidosoft.erp.validation.ColumnLimits.ITEM_SPECIFICATION_LENGTH;
import static com.spidosoft.erp.validation.ColumnLimits.ITEM_UOM_LENGTH;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.spidosoft.erp.common.Tbd;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * Write model for {@code dbo.ItemMaster}.
 *
 * <p>Constraints are <b>only</b> the confirmed column limits (ColumnLimits) and the confirmed
 * {@code NOT NULL} on {@code ItemCode}. No business-required field is invented (docs/10 §9-7).
 *
 * <p>Deliberately excluded: {@code ID} (identity/assignment TBD, C15) and the audit columns {@code Username},
 * {@code LoginBranch}, {@code SystEmentryDate}, {@code UserId}, {@code BranchId} (population rules TBD, §9-9).
 */
public record ItemRequest(
        // TBD — pending Spidosoft confirmation: is ItemCode user-entered or generated? (§9-2).
        // NOT NULL is confirmed by the schema (E1), so it is required while it is client-supplied.
        @Tbd(value = "ItemCode generation rule", ref = "§9-2")
        @JsonProperty("ItemCode") @NotNull @Size(max = ITEM_CODE_LENGTH) String itemCode,
        @JsonProperty("ItemName") String itemName,
        @JsonProperty("Material") String material,
        @JsonProperty("ItemType") String itemType,
        @JsonProperty("ItemSubType") String itemSubType,
        @Tbd(value = "authoritative: Color text vs ColourId", ref = "C4")
        @JsonProperty("Color") String color,
        @Tbd(value = "authoritative: UOM text vs UnitId", ref = "C4")
        @JsonProperty("UOM") @Size(max = ITEM_UOM_LENGTH) String uom,
        @JsonProperty("HSNCODE") @Size(max = ITEM_HSNCODE_LENGTH) String hsnCode,
        // TBD — pending Spidosoft confirmation: store unset numbers as 0 or NULL? (C14)
        @Tbd(value = "0 vs NULL default", ref = "C14")
        @JsonProperty("GSTRate") @Digits(integer = DECIMAL_20_2_INTEGER, fraction = DECIMAL_20_2_FRACTION)
        BigDecimal gstRate,
        @JsonProperty("PurchaseCost") @Digits(integer = DECIMAL_20_2_INTEGER, fraction = DECIMAL_20_2_FRACTION)
        BigDecimal purchaseCost,
        @JsonProperty("SellingPrice") @Digits(integer = DECIMAL_20_2_INTEGER, fraction = DECIMAL_20_2_FRACTION)
        BigDecimal sellingPrice,
        @JsonProperty("RawMaterial") @Size(max = ITEM_RAW_MATERIAL_LENGTH) String rawMaterial,
        // TBD — pending Spidosoft confirmation: FK target tables are not shown (decision 8)
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("SubCategoryId") Integer subCategoryId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("ManufacturerId") Integer manufacturerId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("ColourId") Integer colourId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("UnitId") Integer unitId,
        @Tbd(value = "FK target", ref = "§9-8") @JsonProperty("CategoryId") Integer categoryId,
        @JsonProperty("DrawingNo") @Size(max = ITEM_DRAWING_NO_LENGTH) String drawingNo,
        @JsonProperty("Specification") @Size(max = ITEM_SPECIFICATION_LENGTH) String specification) {
}
