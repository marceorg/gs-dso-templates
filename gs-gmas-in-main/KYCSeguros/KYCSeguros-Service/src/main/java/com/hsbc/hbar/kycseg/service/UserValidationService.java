/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.service;

import javax.servlet.http.HttpServletRequest;

import com.hsbc.hbar.kycseg.model.common.AuthorizedUser;

/**
 * Validacion de Usuario
 */
public interface UserValidationService {
	public AuthorizedUser getAuthorizedUser(
			final HttpServletRequest httpServletRequest, final Integer cache);

	public Boolean setAuthorizedUser(
			final HttpServletRequest httpServletRequest, final String peopleSoft);
}
