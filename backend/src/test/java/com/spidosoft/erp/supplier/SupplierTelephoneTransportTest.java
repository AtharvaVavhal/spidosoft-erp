package com.spidosoft.erp.supplier;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spidosoft.erp.supplier.dto.SupplierRequest;
import com.spidosoft.erp.supplier.dto.SupplierResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;

/**
 * SupplierMaster.Telephone is numeric(18,0). Up to 18 digits exceeds JavaScript's safe-integer range, so the
 * API transports it as a JSON string of digits without losing precision (docs/07 §0).
 */
@JsonTest
class SupplierTelephoneTransportTest {

    /** 18 digits, above Number.MAX_SAFE_INTEGER (9007199254740991). */
    private static final long EIGHTEEN_DIGITS = 987_654_321_098_765_432L;

    @Autowired
    private ObjectMapper objectMapper;

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    private static SupplierResponse response(Long telephone, Long mobile) {
        return new SupplierResponse(1, "SMSP0001", null, null, null, null, null, null, null, null, null, null,
                telephone, mobile, null, null, null, null, null, null, null, null, null, null, null, null, null);
    }

    @Test
    void telephoneIsSerializedAsExactDigitString() throws Exception {
        JsonNode json = objectMapper.readTree(objectMapper.writeValueAsString(response(EIGHTEEN_DIGITS, 9820011111L)));

        assertThat(json.get("Telephone").isTextual()).isTrue();
        assertThat(json.get("Telephone").asText()).isEqualTo("987654321098765432");
        // Mobile (numeric(10,0)) fits JavaScript numbers and stays numeric.
        assertThat(json.get("Mobile").isNumber()).isTrue();
    }

    @Test
    void nullTelephoneStaysNull() throws Exception {
        JsonNode json = objectMapper.readTree(objectMapper.writeValueAsString(response(null, null)));

        assertThat(json.get("Telephone").isNull()).isTrue();
    }

    @Test
    void requestAcceptsTelephoneAsDigitString() throws Exception {
        SupplierRequest request = objectMapper.readValue("{\"Telephone\":\"987654321098765432\"}", SupplierRequest.class);

        assertThat(request.telephone()).isEqualTo(EIGHTEEN_DIGITS);
        assertThat(validator.validate(request)).isEmpty();
    }

    @Test
    void requestRejectsMoreThanEighteenDigits() throws Exception {
        SupplierRequest request = objectMapper.readValue("{\"Telephone\":\"1234567890123456789\"}", SupplierRequest.class);

        assertThat(validator.validate(request).stream()
                .map(ConstraintViolation::getPropertyPath)
                .map(Object::toString)
                .collect(Collectors.toSet())).containsExactly("telephone");
    }
}
