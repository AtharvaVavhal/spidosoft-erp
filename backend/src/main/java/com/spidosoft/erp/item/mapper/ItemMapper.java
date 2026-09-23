package com.spidosoft.erp.item.mapper;

import com.spidosoft.erp.common.Tbd;
import org.mapstruct.Mapper;

/**
 * MapStruct mapper between the ItemMaster persistence model and {@code ItemRequest}/{@code ItemResponse}.
 *
 * <p>Intentionally empty: the persistence model (entity) is not created until the Item key, identity and
 * FK targets are confirmed. Add {@code toResponse(entity)} / {@code toEntity(request)} then.
 */
@Tbd(value = "persistence model", ref = "§10")
@Mapper
public interface ItemMapper {
}
