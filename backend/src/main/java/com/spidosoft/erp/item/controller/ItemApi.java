package com.spidosoft.erp.item.controller;

import com.spidosoft.erp.common.PageQuery;
import com.spidosoft.erp.item.dto.ItemRequest;
import com.spidosoft.erp.item.dto.ItemResponse;
import com.spidosoft.erp.item.dto.ItemSearchCriteria;
import com.spidosoft.erp.response.ApiResponse;
import com.spidosoft.erp.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * PROVISIONAL HTTP contract for Item Master (docs/07 — a technical proposal, not a Spidosoft requirement).
 * No {@code @RestController} implements this interface yet, so these endpoints are not served.
 */
@Tag(name = "Item Master (provisional)")
@RequestMapping("/api/items")
public interface ItemApi {

    @GetMapping
    @Operation(summary = "Search items by code or name (provisional)")
    ApiResponse<PageResponse<ItemResponse>> search(@ParameterObject ItemSearchCriteria criteria,
                                                   @Valid @ParameterObject PageQuery page);

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create an item (provisional — blocked by docs/10 §10)")
    ApiResponse<ItemResponse> create(@Valid @RequestBody ItemRequest request);
}
