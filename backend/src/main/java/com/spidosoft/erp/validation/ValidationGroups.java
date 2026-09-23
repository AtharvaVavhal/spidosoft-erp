package com.spidosoft.erp.validation;

import jakarta.validation.groups.Default;

/** Bean Validation groups for constraints that differ between create and update. */
public final class ValidationGroups {

    /** Constraints that apply only when creating a record. */
    public interface OnCreate extends Default {
    }

    /** Constraints that apply only when updating a record. */
    public interface OnUpdate extends Default {
    }

    private ValidationGroups() {
    }
}
