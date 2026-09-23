package com.spidosoft.erp.application;

import com.spidosoft.erp.config.ErpProperties;
import com.spidosoft.erp.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.sql.Connection;
import java.sql.SQLException;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.SpringBootVersion;
import org.springframework.boot.info.BuildProperties;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Operational endpoints. These are the only implemented endpoints in the foundation phase. */
@Slf4j
@RestController
@RequestMapping("/api/system")
@RequiredArgsConstructor
@Tag(name = "System", description = "Health and version")
public class SystemController {

    private static final int DB_VALIDATION_TIMEOUT_SECONDS = 2;

    private final ErpProperties properties;
    private final ObjectProvider<DataSource> dataSource;
    private final ObjectProvider<BuildProperties> buildProperties;

    @GetMapping("/health")
    @Operation(summary = "Application and database health")
    public ApiResponse<SystemHealthResponse> health() {
        return ApiResponse.ok(new SystemHealthResponse("UP", databaseStatus()));
    }

    @GetMapping("/version")
    @Operation(summary = "Application build and runtime versions")
    public ApiResponse<SystemVersionResponse> version() {
        BuildProperties build = buildProperties.getIfAvailable();
        return ApiResponse.ok(new SystemVersionResponse(
                build != null ? build.getName() : "spidosoft-erp-backend",
                build != null ? build.getVersion() : "dev",
                build != null && build.getTime() != null ? build.getTime().toString() : null,
                Runtime.version().toString(),
                SpringBootVersion.getVersion()));
    }

    private String databaseStatus() {
        DataSource ds = properties.database().configured() ? dataSource.getIfAvailable() : null;
        if (ds == null) {
            return "NOT_CONFIGURED";
        }
        try (Connection connection = ds.getConnection()) {
            return connection.isValid(DB_VALIDATION_TIMEOUT_SECONDS) ? "UP" : "DOWN";
        } catch (SQLException ex) {
            log.warn("Database health check failed: {}", ex.getMessage());
            return "DOWN";
        }
    }
}
