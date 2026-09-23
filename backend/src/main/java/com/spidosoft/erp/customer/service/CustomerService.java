package com.spidosoft.erp.customer.service;

import com.spidosoft.erp.common.PageQuery;
import com.spidosoft.erp.customer.dto.CustomerOptionResponse;
import com.spidosoft.erp.customer.dto.CustomerResponse;
import com.spidosoft.erp.response.PageResponse;
import java.util.List;

/** Customer Master read use cases. <b>No implementation exists</b> (docs/10 §10). */
public interface CustomerService {

    /** @param q free text matched against {@code CustCode} and {@code CustName} */
    PageResponse<CustomerResponse> search(String q, PageQuery page);

    /** @param id {@code CustomerMaster.Id} — the confirmed primary key */
    CustomerResponse getById(int id);

    /** Filtering (branch, active) and ordering are TBD (docs/02 Q-12). */
    List<CustomerOptionResponse> listOptions();
}
