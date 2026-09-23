/**
 * Item Master module — {@code dbo.ItemMaster} (docs/04 §2, 25 confirmed columns).
 *
 * <p><b>Status: contracts only.</b> DTOs, mapper, service and controller interfaces exist; there is no entity,
 * repository or implementation. Blocked by docs/10 §10: database engine/access (decision 1), Item key and
 * identity — {@code ID} and {@code ItemCode} are both marked PK (decision 2 / C3), FK target tables
 * (decision 8) and audit-column population (decision 9).
 */
package com.spidosoft.erp.item;
