/**
 * Item ↔ Customer/Supplier mapping module.
 *
 * <p><b>Persistence model intentionally deferred.</b>
 *
 * <p>docs/04 §5 and docs/10 record that <i>mapping persistence structure is UNKNOWN</i>: the Supplied
 * Requirement Material names no mapping table, no linking column and no SQL. This module therefore contains
 * architecture and placeholder interfaces only. It must not gain an entity, repository, join table or
 * migration until Spidosoft answers docs/10 §9 decisions 3 (storage), 4 (cardinality, "OR" semantics,
 * duplicates), 5 (Id vs Code) and 6 (what Add / Save / Delete persist).
 *
 * <p>Confirmed today (docs/10 §5): the screen offers Is Supplier / Is Customer, Select Code, Select Name, Add,
 * a GridView (S.No, Code, Name, Action → Delete), Save and Clear; clicking <b>Add</b> binds the selection into
 * the GridView. That behaviour lives in the frontend and needs no persistence.
 *
 * <ul>
 *   <li>{@code dto} — {@link com.spidosoft.erp.mapping.dto.PartyType} (the confirmed Is Supplier / Is Customer choice)</li>
 *   <li>{@code service} — {@link com.spidosoft.erp.mapping.service.MappingService} placeholder</li>
 *   <li>{@code controller} — {@link com.spidosoft.erp.mapping.controller.MappingApi} placeholder</li>
 *   <li>{@code mapper} — {@link com.spidosoft.erp.mapping.mapper.MappingMapper} placeholder</li>
 * </ul>
 */
package com.spidosoft.erp.mapping;
