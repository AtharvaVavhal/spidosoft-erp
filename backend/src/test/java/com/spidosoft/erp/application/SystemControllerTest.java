package com.spidosoft.erp.application;

import static org.hamcrest.Matchers.matchesPattern;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class SystemControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    void healthReportsUpAndNoDatabase() throws Exception {
        mvc.perform(get("/api/system/health"))
                .andExpect(status().isOk())
                .andExpect(header().string("X-Request-Id", matchesPattern("[A-Za-z0-9-]{1,64}")))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"))
                .andExpect(jsonPath("$.data.database").value("NOT_CONFIGURED"))
                .andExpect(jsonPath("$.error").doesNotExist());
    }

    @Test
    void versionReportsRuntime() throws Exception {
        mvc.perform(get("/api/system/version"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").isNotEmpty())
                .andExpect(jsonPath("$.data.javaVersion").value(matchesPattern("21.*")))
                .andExpect(jsonPath("$.data.springBootVersion").value(matchesPattern("3\\..*")));
    }

    @Test
    void wellFormedIncomingRequestIdIsReused() throws Exception {
        mvc.perform(get("/api/system/health").header("X-Request-Id", "abc-123"))
                .andExpect(header().string("X-Request-Id", "abc-123"));
    }

    @Test
    void malformedIncomingRequestIdIsReplaced() throws Exception {
        mvc.perform(get("/api/system/health").header("X-Request-Id", "bad id <script>"))
                .andExpect(header().string("X-Request-Id", matchesPattern("[0-9a-f-]{36}")));
    }

    @Test
    void domainEndpointsAreNotServedYet() throws Exception {
        // Contracts exist as interfaces only; nothing implements them (docs/10 §10).
        mvc.perform(get("/api/items"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("NOT_FOUND"));
    }
}
