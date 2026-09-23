package com.spidosoft.erp.exception;

/**
 * Thrown by an operation whose behaviour depends on an open Spidosoft decision, instead of guessing.
 *
 * @see com.spidosoft.erp.common.Tbd
 */
public class PendingConfirmationException extends ErpException {

    public PendingConfirmationException(String decisionRef) {
        super(ErrorCode.PENDING_CONFIRMATION,
                ErrorCode.PENDING_CONFIRMATION.defaultMessage() + " (docs/10 " + decisionRef + ")");
    }
}
