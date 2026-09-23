package com.spidosoft.erp.customer.controller;

import com.spidosoft.erp.common.PageQuery;
import com.spidosoft.erp.customer.dto.CustomerOptionResponse;
import com.spidosoft.erp.customer.dto.CustomerResponse;
import com.spidosoft.erp.response.ApiResponse;
import com.spidosoft.erp.response.PageResponse;
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
@Tag(name = "Customer Master (provisional)")
@RequestMapping("/api/customers")
public interface CustomerApi {

    @GetMapping
    @Operation(summary = "Search customers (provisional)")
    ApiResponse<PageResponse<CustomerResponse>> search(@RequestParam(required = false) String q,
                                                       @Valid @ParameterObject PageQuery page);

    @GetMapping("/{id}")
    @Operation(summary = "Get a customer by Id (provisional)")
    ApiResponse<CustomerResponse> getById(@PathVariable int id);

    @GetMapping("/options")
    @Operation(summary = "Options for the mapping Select Code / Select Name controls (provisional)")
    ApiResponse<List<CustomerOptionResponse>> listOptions();
}
