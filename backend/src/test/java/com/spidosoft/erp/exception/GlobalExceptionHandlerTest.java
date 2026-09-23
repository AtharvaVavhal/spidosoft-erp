package com.spidosoft.erp.exception;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.spidosoft.erp.response.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootTest
@AutoConfigureMockMvc
@Import(GlobalExceptionHandlerTest.ProbeController.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    void validationFailureListsFieldViolations() throws Exception {
        mvc.perform(post("/test/probe").contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"toolong\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.error.violations.length()").value(2))
                .andExpect(jsonPath("$.error.path").value("/test/probe"))
                .andExpect(jsonPath("$.error.requestId").isNotEmpty());
    }

    @Test
    void malformedJsonIsReportedWithoutDetails() throws Exception {
        mvc.perform(post("/test/probe").contentType(MediaType.APPLICATION_JSON).content("{not json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("MALFORMED_REQUEST"));
    }

    @Test
    void typeMismatchIsReported() throws Exception {
        mvc.perform(get("/test/probe/not-a-number"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("TYPE_MISMATCH"))
                .andExpect(jsonPath("$.error.violations[0].field").value("id"));
    }

    @Test
    void pendingConfirmationMapsTo501() throws Exception {
        mvc.perform(get("/test/probe/pending"))
                .andExpect(status().isNotImplemented())
                .andExpect(jsonPath("$.error.code").value("PENDING_CONFIRMATION"));
    }

    @Test
    void unexpectedErrorsDoNotLeakInternals() throws Exception {
        mvc.perform(get("/test/probe/boom"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error.code").value("INTERNAL_ERROR"))
                .andExpect(jsonPath("$.error.message").value(ErrorCode.INTERNAL_ERROR.defaultMessage()));
    }

    @Test
    void wrongMethodIs405() throws Exception {
        mvc.perform(post("/api/system/health"))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.error.code").value("METHOD_NOT_ALLOWED"));
    }

    record ProbeRequest(@NotNull String code, @Size(max = 3) String name) {
    }

    @TestConfiguration
    @RestController
    static class ProbeController {

        @PostMapping("/test/probe")
        ApiResponse<String> create(@Valid @RequestBody ProbeRequest request) {
            return ApiResponse.ok("ok");
        }

        @GetMapping("/test/probe/pending")
        ApiResponse<String> pending() {
            throw new PendingConfirmationException("C3");
        }

        @GetMapping("/test/probe/boom")
        ApiResponse<String> boom() {
            throw new IllegalStateException("secret internal detail");
        }

        @GetMapping("/test/probe/{id}")
        ApiResponse<Integer> byId(@PathVariable int id) {
            return ApiResponse.ok(id);
        }
    }
}
