/**
 * Supplier Master module — {@code dbo.SupplierMaster} (docs/04 §4, 27 confirmed columns).
 *
 * <p><b>Status: contracts only.</b> Differences from CustomerMaster are preserved, not reconciled:
 * {@code supptypeid} is lower-case and not marked FK; {@code CountryId}/{@code StateId}/{@code CityId}/
 * {@code BranchId}/{@code LoginUserId} are not marked FK (C5, C6); {@code PinCode}, {@code Telephone} and
 * {@code Mobile} are numeric (C7).
 */
package com.spidosoft.erp.supplier;
