package com.spidosoft.erp.item.service;

import com.spidosoft.erp.common.PageQuery;
import com.spidosoft.erp.common.Tbd;
import com.spidosoft.erp.item.dto.ItemRequest;
import com.spidosoft.erp.item.dto.ItemResponse;
import com.spidosoft.erp.item.dto.ItemSearchCriteria;
import com.spidosoft.erp.response.PageResponse;

/**
 * Item Master use cases. <b>No implementation exists</b> (docs/10 §10).
 *
 * <p>Key-based operations (get, update, delete) are intentionally absent: {@code ID} and {@code ItemCode} are
 * both marked PK, and which identifies an Item is undecided (C3). They will be added with the confirmed key.
 */
public interface ItemService {

    PageResponse<ItemResponse> search(ItemSearchCriteria criteria, PageQuery page);

    @Tbd(value = "code generation, required fields, audit population", ref = "§9-2, §9-7, §9-9")
    ItemResponse create(ItemRequest request);
}
