package com.spidosoft.erp.supplier.service;

import com.spidosoft.erp.common.PageQuery;
import com.spidosoft.erp.response.PageResponse;
import com.spidosoft.erp.supplier.dto.SupplierOptionResponse;
import com.spidosoft.erp.supplier.dto.SupplierResponse;
import java.util.List;

/** Supplier Master read use cases. <b>No implementation exists</b> (docs/10 §10). */
public interface SupplierService {

    /** @param q free text matched against {@code SuppCode} and {@code SuppName} */
    PageResponse<SupplierResponse> search(String q, PageQuery page);

    /** @param id {@code SupplierMaster.Id} — the confirmed primary key */
    SupplierResponse getById(int id);

    /** Filtering (branch, active) and ordering are TBD (docs/02 Q-12). */
    List<SupplierOptionResponse> listOptions();
}
