package com.spidosoft.erp.validation;

/**
 * Length and precision limits taken from the column types shown in the Supplied Requirement Material
 * (docs/04-database-schema.md, evidence E1–E6). These are <b>type limits</b>, not business rules.
 *
 * <p>{@code varchar(max)} columns get no length limit here: the engine is TBD, so its maximum is unknown.
 * {@code decimal(p,s)} maps to {@code @Digits(integer = p - s, fraction = s)}.
 */
public final class ColumnLimits {

    // dbo.ItemMaster (E1, E2)
    public static final int ITEM_CODE_LENGTH = 255;      // ItemCode varchar(255)
    public static final int ITEM_UOM_LENGTH = 255;       // UOM varchar(255)
    public static final int ITEM_HSNCODE_LENGTH = 255;   // HSNCODE varchar(255)
    public static final int ITEM_RAW_MATERIAL_LENGTH = 50; // RawMaterial varchar(50)
    public static final int ITEM_DRAWING_NO_LENGTH = 50; // DrawingNo varchar(50)
    public static final int ITEM_SPECIFICATION_LENGTH = 500; // Specification varchar(500)
    /** GSTRate, PurchaseCost, SellingPrice: decimal(20,2). */
    public static final int DECIMAL_20_2_INTEGER = 18;
    public static final int DECIMAL_20_2_FRACTION = 2;

    // dbo.CustomerMaster (E3)
    public static final int CUSTOMER_PIN_CODE_LENGTH = 20;  // PinCode varchar(20)
    public static final int CUSTOMER_TELEPHONE_LENGTH = 20; // Telephone varchar(20)
    public static final int CUSTOMER_MOBILE_LENGTH = 20;    // Mobile varchar(20)

    // dbo.SupplierMaster (E5) — numeric types differ from CustomerMaster (docs/10 C7, not reconciled)
    public static final int SUPPLIER_PIN_CODE_DIGITS = 6;   // PinCode numeric(6,0)
    public static final int SUPPLIER_TELEPHONE_DIGITS = 18; // Telephone numeric(18,0)
    public static final int SUPPLIER_MOBILE_DIGITS = 10;    // Mobile numeric(10,0)

    private ColumnLimits() {
    }
}
