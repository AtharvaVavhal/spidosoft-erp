package com.spidosoft.erp.mapping.service;

import com.spidosoft.erp.common.Tbd;

/**
 * Placeholder for mapping use cases. <b>Persistence model intentionally deferred.</b>
 *
 * <p>Operations (load an Item's mappings, save the GridView, delete a row) are not declared because their
 * signatures depend on the Item key (C3), the party identifier (C8) and the Save/Delete semantics (§9-6),
 * none of which is confirmed. Declaring them now would encode an invented persistence model.
 */
@Tbd(value = "mapping storage, cardinality, identifiers, Save/Delete semantics", ref = "§9-3..6")
public interface MappingService {
}
