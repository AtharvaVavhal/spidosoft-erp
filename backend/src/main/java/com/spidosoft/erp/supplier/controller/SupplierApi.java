package com.spidosoft.erp.supplier.controller;

import com.spidosoft.erp.common.PageQuery;
import com.spidosoft.erp.response.ApiResponse;
import com.spidosoft.erp.response.PageResponse;
import com.spidosoft.erp.supplier.dto.SupplierOptionResponse;
import com.spidosoft.erp.supplier.dto.SupplierResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/** PROVISIONAL HTTP contract (docs/07). Not implemented, therefore not served. */
@Tag(name = "Supplier Master (provisional)")
@RequestMapping("/api/suppliers")
public interface SupplierApi {

    @GetMapping
    @Operation(summary = "Search suppliers (provisional)")
    ApiResponse<PageResponse<SupplierResponse>> search(@RequestParam(required = false) String q,
                                                       @Valid @ParameterObject PageQuery page);

    @GetMapping("/{id}")
    @Operation(summary = "Get a supplier by Id (provisional)")
    ApiResponse<SupplierResponse> getById(@PathVariable int id);

    @GetMapping("/options")
    @Operation(summary = "Options for the mapping Select Code / Select Name controls (provisional)")
    ApiResponse<List<SupplierOptionResponse>> listOptions();
}
