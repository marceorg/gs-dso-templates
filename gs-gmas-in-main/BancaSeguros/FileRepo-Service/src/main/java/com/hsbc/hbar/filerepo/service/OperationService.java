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

public interface OperationService {
	public String getSolicitudList(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud);

	public String getSolFiltroList(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud, final String propuesta, final Integer fase, final Integer estado, final Integer otro,
			final String oficina, final String asesor, final Long fechaIngDesde, final Long fechaIngHasta,
			final Long fechaManDesde, final Long fechaManHasta, final Integer asegTipDoc, final String asegNroDoc,
			final String asegApellido, final String asegNombre);

	public String setSolicitud(final HttpServletRequest httpServletRequest, final Integer cache, final Integer tipoCambio,
			final String producto, final Long solicitud, final Integer estado, final Integer otroCod,
			final String observaciones);

	public String getArchivoXSolList(final HttpServletRequest httpServletRequest, final Integer cache,
			final String producto, final Long solicitud, final Long archivo);

	public String getArcFiltroList(final HttpServletRequest httpServletRequest, final Integer cache, final Integer tipoDoc,
			final String tipoArchivo, final Integer arcTipDoc, final String arcNroDoc, final String arcDato1,
			final String arcDato2, final String arcDato3, final String arcDato4, final Long fechaIngDesde,
			final Long fechaIngHasta);

	public String delArchivoXSol(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud, final Long archivo, final String observaciones);

	public String getHisSolicitudList(final HttpServletRequest httpServletRequest, final Integer cache,
			final String producto, final Long solicitud);

	public String getRetDocPendList(final HttpServletRequest httpServletRequest, final Integer cache, final String propuesta);

	public String getBatchLogList(final HttpServletRequest httpServletRequest, final Integer cache, final Integer fecha);

	public String getSolicitCklList(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud);

	public String setSolicitCkl(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud, final Integer fase, final Integer ordenCkl, final String datoCkl);

	public String setSolicitTSo(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud, final String tipSol);

	public String setSolicitFas(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud, final Integer fase, final String observaciones);

	public String getSiniestroList(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion);

	public String getSinFiltroList(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final String producto, final String poliza, final Integer estado, final Long fechaIngDesde,
			final Long fechaIngHasta, final Long fechaManDesde, final Long fechaManHasta, final Integer asegTipDoc,
			final String asegNroDoc, final String asegApellido, final String asegNombre, final Integer tomaTipDoc,
			final String tomaNroDoc, final String tomaApellido, final String tomaNombre, final Integer denuTipDoc,
			final String denuNroDoc, final String denuApellido, final String denuNombre);

	public String setSiniestro(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Integer estado, final String observaciones);

	public String getArchivoXSinList(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Long archivo);

	public String setArchivoXSin(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Long archivo, final String observaciones);

	public String delArchivoXSin(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Long archivo, final String observaciones);

	public String getDDBenefList(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion);

	public String getDBeFiltroList(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final String producto, final String poliza, final Integer estado, final Long fechaIngDesde,
			final Long fechaIngHasta, final Long fechaManDesde, final Long fechaManHasta, final Integer asegTipDoc,
			final String asegNroDoc, final String asegApellido, final String asegNombre, final Integer tomaTipDoc,
			final String tomaNroDoc, final String tomaApellido, final String tomaNombre);

	public String setDDBenef(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Integer estado, final String observaciones);

	public String getArchivoXDBeList(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Long archivo);

	public String delArchivoXDBe(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Long archivo, final String observaciones);

	public String getRetColList(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long operacion);

	public String getRCoFiltroList(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long operacion, final String poliza, final Integer estado, final Long fechaIngDesde,
			final Long fechaIngHasta, final Long fechaManDesde, final Long fechaManHasta, final Integer asegTipDoc,
			final String asegNroDoc, final String asegApellido, final String asegNombre, final Integer tomaTipDoc,
			final String tomaNroDoc, final String tomaApellido, final String tomaNombre, final String reqAdic);

	public String setRetCol(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long operacion, final Integer estado, final String observaciones);

	public String getArchivoXRCoList(final HttpServletRequest httpServletRequest, final Integer cache,
			final String producto, final Long operacion, final Long archivo, final String ideArch);

	public String delArchivoXRCo(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long operacion, final Long archivo, final String observaciones);
}
