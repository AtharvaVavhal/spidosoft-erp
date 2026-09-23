package com.spidosoft.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * SpidoSoft ERP backend entry point.
 *
 * <p>Foundation only: no persistence is configured by default (profile {@code nodb}). Domain modules expose
 * contracts (DTOs, service and controller interfaces) for fields confirmed in
 * {@code docs/04-database-schema.md}; implementations wait for the decisions in
 * {@code docs/10-database-requirements-validation.md}.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class ErpApplication {

    public static void main(String[] args) {
        SpringApplication.run(ErpApplication.class, args);
    }
}
