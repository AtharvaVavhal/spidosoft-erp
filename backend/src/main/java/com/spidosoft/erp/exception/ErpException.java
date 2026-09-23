package com.spidosoft.erp.exception;

/** Base class for expected, client-facing errors. The message must be safe to show to users. */
public class ErpException extends RuntimeException {

    private final ErrorCode errorCode;

    public ErpException(ErrorCode errorCode) {
        this(errorCode, errorCode.defaultMessage());
    }

    public ErpException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public ErrorCode errorCode() {
        return errorCode;
    }
}
