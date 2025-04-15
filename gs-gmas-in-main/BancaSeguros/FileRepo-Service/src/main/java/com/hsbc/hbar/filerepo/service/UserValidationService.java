/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2018. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.filerepo.service;

import javax.servlet.http.HttpServletRequest;

import com.hsbc.hbar.filerepo.model.common.AuthorizedUser;

// Validacion de Usuario

public interface UserValidationService {
	public AuthorizedUser getAuthorizedUser(final HttpServletRequest httpServletRequest, final Integer cache);

	public Boolean setAuthorizedUser(final HttpServletRequest httpServletRequest, final Integer cache,
			final String peopleSoft);

	public Boolean getPermissionGrant(final String perfil, final String tipoPer, final String funcionalidad);

	public Boolean getSolicitudGrant(final String producto, final String solicitud, final String perfil,
			final String peopleSoft);

	public Boolean getSolicVerGrant(final String producto, final String solicitud, final String fase);

	public Boolean getTipoDocumGrant(final String producto, final String solicitud, final String archivo,
			final String peopleSoft);

	public Boolean getUserFileGrant(final String producto, final String solicitud, final String archivo,
			final String peopleSoft);
}
