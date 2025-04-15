/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2016. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the prior
 * written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.model.exception;

public class UnauthorizedUserException extends Exception {
	private static final long serialVersionUID = 928558896899270021L;

	public UnauthorizedUserException() {
		super();
	}

	public UnauthorizedUserException(final String msg) {
		super(msg);
	}

	public UnauthorizedUserException(final String msg, final Throwable cause) {
		super(msg, cause);
	}
}