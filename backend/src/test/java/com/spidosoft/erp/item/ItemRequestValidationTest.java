package com.spidosoft.erp.item;

import static org.assertj.core.api.Assertions.assertThat;

import com.spidosoft.erp.item.dto.ItemRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;

/** ItemRequest enforces the confirmed column limits only — and nothing else. */
class ItemRequestValidationTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    private static ItemRequest request(String itemCode, BigDecimal gstRate, String drawingNo) {
        return new ItemRequest(itemCode, null, null, null, null, null, null, null, gstRate, null, null, null,
                null, null, null, null, null, drawingNo, null);
    }

    private Set<String> invalidFields(ItemRequest request) {
        return validator.validate(request).stream()
                .map(ConstraintViolation::getPropertyPath)
                .map(Object::toString)
                .collect(Collectors.toSet());
    }

    @Test
    void onlyItemCodeIsRequired() {
        assertThat(invalidFields(request("RM-1", null, null))).isEmpty();
        assertThat(invalidFields(request(null, null, null))).containsExactly("itemCode");
    }

    @Test
    void itemCodeIsLimitedTo255() {
        assertThat(invalidFields(request("x".repeat(255), null, null))).isEmpty();
        assertThat(invalidFields(request("x".repeat(256), null, null))).containsExactly("itemCode");
    }

    @Test
    void decimalsFollowDecimal20Scale2() {
        assertThat(invalidFields(request("RM-1", new BigDecimal("18.00"), null))).isEmpty();
        assertThat(invalidFields(request("RM-1", new BigDecimal("18.005"), null))).containsExactly("gstRate");
        assertThat(invalidFields(request("RM-1", new BigDecimal("1".repeat(19)), null))).containsExactly("gstRate");
    }

    @Test
    void drawingNoIsLimitedTo50() {
        assertThat(invalidFields(request("RM-1", null, "d".repeat(51)))).containsExactly("drawingNo");
    }
}
