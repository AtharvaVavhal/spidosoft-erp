package com.spidosoft.erp.exception;

import com.spidosoft.erp.config.RequestIdFilter;
import com.spidosoft.erp.response.ApiError;
import com.spidosoft.erp.response.ApiResponse;
import com.spidosoft.erp.response.FieldViolation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * Translates every exception into the {@link ApiResponse} envelope. Internal details (stack traces,
 * SQL, class names) are logged, never returned.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BindException.class) // includes MethodArgumentNotValidException
    ResponseEntity<ApiResponse<Void>> handleBind(BindException ex, HttpServletRequest request) {
        List<FieldViolation> violations = new ArrayList<>();
        ex.getFieldErrors().forEach(e -> violations.add(new FieldViolation(e.getField(), e.getDefaultMessage())));
        ex.getGlobalErrors().forEach(e -> violations.add(new FieldViolation("", e.getDefaultMessage())));
        return respond(ErrorCode.VALIDATION_FAILED, ErrorCode.VALIDATION_FAILED.defaultMessage(), violations, request);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    ResponseEntity<ApiResponse<Void>> handleMethodValidation(HandlerMethodValidationException ex,
                                                             HttpServletRequest request) {
        List<FieldViolation> violations = new ArrayList<>();
        ex.getParameterValidationResults().forEach(result -> {
            String name = result.getMethodParameter().getParameterName();
            result.getResolvableErrors().forEach(e ->
                    violations.add(new FieldViolation(name == null ? "" : name, e.getDefaultMessage())));
        });
        return respond(ErrorCode.VALIDATION_FAILED, ErrorCode.VALIDATION_FAILED.defaultMessage(), violations, request);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<ApiResponse<Void>> handleConstraintViolation(ConstraintViolationException ex,
                                                                HttpServletRequest request) {
        List<FieldViolation> violations = ex.getConstraintViolations().stream()
                .map(v -> new FieldViolation(lastNode(v.getPropertyPath().toString()), v.getMessage()))
                .toList();
        return respond(ErrorCode.VALIDATION_FAILED, ErrorCode.VALIDATION_FAILED.defaultMessage(), violations, request);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<ApiResponse<Void>> handleUnreadable(HttpMessageNotReadableException ex, HttpServletRequest request) {
        return respond(ErrorCode.MALFORMED_REQUEST, request);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    ResponseEntity<ApiResponse<Void>> handleMissingParameter(MissingServletRequestParameterException ex,
                                                             HttpServletRequest request) {
        return respond(ErrorCode.MISSING_PARAMETER, ErrorCode.MISSING_PARAMETER.defaultMessage(),
                List.of(new FieldViolation(ex.getParameterName(), "is required")), request);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException ex,
                                                         HttpServletRequest request) {
        return respond(ErrorCode.TYPE_MISMATCH, ErrorCode.TYPE_MISMATCH.defaultMessage(),
                List.of(new FieldViolation(ex.getName(), "has an invalid value")), request);
    }

    @ExceptionHandler({NoResourceFoundException.class, NoHandlerFoundException.class})
    ResponseEntity<ApiResponse<Void>> handleNoHandler(Exception ex, HttpServletRequest request) {
        return respond(ErrorCode.NOT_FOUND, request);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    ResponseEntity<ApiResponse<Void>> handleMethod(HttpRequestMethodNotSupportedException ex,
                                                   HttpServletRequest request) {
        return respond(ErrorCode.METHOD_NOT_ALLOWED, request);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    ResponseEntity<ApiResponse<Void>> handleMediaType(HttpMediaTypeNotSupportedException ex,
                                                      HttpServletRequest request) {
        return respond(ErrorCode.UNSUPPORTED_MEDIA_TYPE, request);
    }

    @ExceptionHandler(ErpException.class)
    ResponseEntity<ApiResponse<Void>> handleErp(ErpException ex, HttpServletRequest request) {
        return respond(ex.errorCode(), ex.getMessage(), List.of(), request);
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiResponse<Void>> handleUnexpected(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception on {} {}", request.getMethod(), request.getRequestURI(), ex);
        return respond(ErrorCode.INTERNAL_ERROR, request);
    }

    private static ResponseEntity<ApiResponse<Void>> respond(ErrorCode code, HttpServletRequest request) {
        return respond(code, code.defaultMessage(), List.of(), request);
    }

    private static ResponseEntity<ApiResponse<Void>> respond(ErrorCode code, String message,
                                                             List<FieldViolation> violations,
                                                             HttpServletRequest request) {
        ApiError error = new ApiError(code.name(), message, violations, request.getRequestURI(),
                MDC.get(RequestIdFilter.MDC_KEY));
        return ResponseEntity.status(code.status()).body(ApiResponse.failure(error));
    }

    private static String lastNode(String propertyPath) {
        int dot = propertyPath.lastIndexOf('.');
        return dot < 0 ? propertyPath : propertyPath.substring(dot + 1);
    }
}
