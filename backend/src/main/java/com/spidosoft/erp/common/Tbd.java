package com.spidosoft.erp.common;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marks code whose behaviour depends on an open Spidosoft decision.
 *
 * <p>Every usage must reference the decision or contradiction in
 * {@code docs/10-database-requirements-validation.md} (for example {@code "C3"} or {@code "§9-2"}).
 * Search for {@code @Tbd} to list every place that changes once the decision is made.
 */
@Documented
@Retention(RetentionPolicy.CLASS)
@Target({ElementType.TYPE, ElementType.FIELD, ElementType.METHOD, ElementType.RECORD_COMPONENT, ElementType.PARAMETER})
public @interface Tbd {

    /** What is pending confirmation. */
    String value();

    /** Reference into docs/10, e.g. "C3" or "§9-2". */
    String ref() default "";
}
