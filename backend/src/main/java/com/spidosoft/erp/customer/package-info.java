/**
 * Customer Master module — {@code dbo.CustomerMaster} (docs/04 §3, 28 confirmed columns).
 *
 * <p><b>Status: contracts only.</b> {@code Id} is the confirmed PK, so read-by-id is safe to specify. Create and
 * update are not specified: Customer create/edit is not in the supplied requirement, and audit/branch
 * population is TBD (docs/10 §9-9). The option list feeds the mapping "Select Code / Select Name" controls.
 */
package com.spidosoft.erp.customer;
