package com.spidosoft.erp.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.info.BuildProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** OpenAPI document served at {@code /api/docs}, Swagger UI at {@code /api/docs/ui}. */
@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI erpOpenApi(ObjectProvider<BuildProperties> buildProperties) {
        BuildProperties build = buildProperties.getIfAvailable();
        return new OpenAPI().info(new Info()
                .title("SpidoSoft ERP API")
                .version(build != null ? build.getVersion() : "dev")
                .description("""
                        Foundation API. Only /api/system endpoints are implemented.
                        Domain contracts (Item, Customer, Supplier) are PROVISIONAL technical proposals — not \
                        Spidosoft requirements — and have no implementation until the backend-blocking \
                        decisions in docs/10-database-requirements-validation.md are resolved. \
                        Mapping persistence is intentionally deferred."""));
    }
}
