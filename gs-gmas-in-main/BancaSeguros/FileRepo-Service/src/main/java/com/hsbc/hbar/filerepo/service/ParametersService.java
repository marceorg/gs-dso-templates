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

public interface ParametersService {
	public Integer getFechaHoy(final Integer cache);

	public String getTipoDocumentalList(final Integer cache, final Integer tipoDoc, final Integer grupoDoc,
			final Boolean indBaja);

	public String setTipoDocumental(final HttpServletRequest httpServletRequest, final Integer cache, final Integer tipoDoc,
			final String descripcion, final Integer grupoDoc, final Boolean indBaja, final Boolean indBorrado,
			final String codFileNet);

	public String getGrupoDocumentalList(final Integer cache);

	public String getPerfilList(final Integer cache);

	public String getFaseList(final Integer cache, final String perfil, final String producto);

	public String getEstadoList(final Integer cache, final Integer estadoActual);

	public String setPerfil(final HttpServletRequest httpServletRequest, final Integer cache, final String perfil,
			final Integer fase, final Boolean reqRevision, final Boolean pAnaLectura, final Boolean pAnaAlta,
			final Boolean pAnaBaja, final Boolean pSupLectura, final Boolean pSupAlta, final Boolean pSupBaja);

	public String getTipoDocumentoList(final Integer cache);

	public String getPendMotivoList(final Integer cache);

	public String getAlertaXFaseList(final Integer cache, final Integer fase);

	public String setAlertaXFase(final HttpServletRequest httpServletRequest, final Integer cache, final Integer fase,
			final String email, final String emailCC, final String emailCCO, final String jsonEstadoList);

	public String getAlertaXEstadoList(final Integer cache, final Integer fase);
}
