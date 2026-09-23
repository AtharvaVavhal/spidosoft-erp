package com.spidosoft.erp.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Application-specific settings under the {@code erp.*} prefix.
 *
 * @param cors     CORS settings for the browser client
 * @param database database state as declared by the active profile
 */
@ConfigurationProperties(prefix = "erp")
public record ErpProperties(Cors cors, Database database) {

    public ErpProperties {
        cors = cors == null ? new Cors(List.of()) : cors;
        database = database == null ? new Database(false) : database;
    }

    /** @param allowedOrigins origins allowed to call {@code /api/**} */
    public record Cors(List<String> allowedOrigins) {
        public Cors {
            allowedOrigins = allowedOrigins == null ? List.of() : List.copyOf(allowedOrigins);
        }
    }

    /** @param configured true only when the "db" profile supplies a datasource */
    public record Database(boolean configured) {
    }
}
