package com.spidosoft.erp.exception;

/** A requested record does not exist. */
public class ResourceNotFoundException extends ErpException {

    public ResourceNotFoundException(String resource, Object identifier) {
        super(ErrorCode.NOT_FOUND, resource + " '" + identifier + "' was not found.");
    }
}
