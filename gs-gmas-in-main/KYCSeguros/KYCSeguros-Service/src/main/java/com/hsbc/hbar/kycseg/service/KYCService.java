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

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.hsbc.hbar.kycseg.model.kyc.KYCPendiente;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersFis;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersJur;
import com.hsbc.hbar.kycseg.model.kyc.KYCSetResp;

public interface KYCService {
	public List<KYCPersFis> getKYCPersFis(
			final HttpServletRequest httpServletRequest, final Integer cache,
			final Long numeroCUIL, final String apellido, final String nombre);

	// fechaNacimiento_PPCR_2015-00142_(ENS)
	public Boolean setKYCPersFis(final Integer cache, final Integer tipoDocNum,
			final String tipoDocDes, final Long numeroDoc,
			final Long numeroCUIL, final String apellido, final String nombre,
			final Integer nacionalidadCod, final Integer fechaNacimiento,
			final String dirCalle, final String dirNumero,
			final String dirPiso, final String dirDepto,
			final Integer dirProvincia, final String dirLocalidad,
			final String dirCodigoPostal, final String telefono,
			final String email, final Boolean tieneRep,
			final String representanteList, final Boolean esTitMPago,
			final String titMPagoList, final Integer actividadCod,
			final String actividadNom, final String actividadDes,
			final String propositoDes, final Boolean esSCC,
			final String motivoSCC, final Boolean esPEP,
			final Boolean tieneRepSCC, final Boolean esClienteBco,
			final Integer condicionIVA, final String condicionLab,
			final String categoriaMono, final Integer ingFecha,
			final Double ingSalMen, final Double ingSalario,
			final Double ingGanancia, final Double ingOtros,
			final Double ingTotal, final String docResDetalle,
			final Boolean tieneRelHSBC, final String relDetalle,
			final Integer inicioAnn, final Double valorOperar,
			final Double primaAnual, final String valorOperarMot,
			final String perfilComentarios, final Integer ultFecha,
			final String opeInusualList, final String opePeopleSoft,
			final String opeApellido, final String opeNombre);

	public KYCSetResp setKYCPersFisAIS(
			final HttpServletRequest httpServletRequest, final Integer cache,
			final Long numeroCUIL, final String tipoOperacion,
			final Boolean actPerfilTrans, final Boolean esKYCNuevo,
			final Integer vigenciaDesde, final Integer vigenciaHasta,
			final Boolean perfilObligenAIS, final String supPeopleSoft,
			final String supApellido, final String supNombre);

	public List<KYCPersJur> getKYCPersJur(
			final HttpServletRequest httpServletRequest, final Integer cache,
			final Long numeroCUIT, final String razonSocial);

	public Boolean setKYCPersJur(final Integer cache, final Long numeroCUIT,
			final String razonSocial, final Integer fechaConstitucion,
			final String dirCalle, final String dirNumero,
			final String dirPiso, final String dirDepto,
			final Integer dirProvincia, final String dirLocalidad,
			final String dirCodigoPostal, final String telefono,
			final String email, final String representanteList,
			final Boolean esTitMPago, final String titMPagoList,
			final Integer actividadCod, final String actividadNom,
			final String actividadDes, final String propositoDes,
			final Integer caracterCod, final String caracterDes,
			final Boolean esClienteBco, final Boolean cotizaBolsa,
			final Boolean subsCiaCotizaBolsa, final Boolean cliRegOrganismo,
			final Boolean esSCC, final String motivoSCC,
			final Boolean tieneRepSCC, final String accionistas,
			final String companiaList, final Boolean tieneRelHSBC,
			final String relDetalle, final Integer inicioAnn,
			final String balAuditor, final Integer balFecha,
			final Double balActivo, final Double balPasivo,
			final Double balPatNeto, final Double balVentas,
			final Double balResFinal, final Integer balFechaEstContable,
			final String docResDetalle, final String observaciones,
			final Double valorOperar, final Double primaAnual,
			final String valorOperarMot, final String perfilComentarios,
			final Integer ultFecha, final String opeInusualList,
			final String opePeopleSoft, final String opeApellido,
			final String opeNombre);

	public KYCSetResp setKYCPersJurAIS(
			final HttpServletRequest httpServletRequest, final Integer cache,
			final Long numeroCUIT, final String tipoOperacion,
			final Boolean actPerfilTrans, final Boolean esKYCNuevo,
			final Integer vigenciaDesde, final Integer vigenciaHasta,
			final Boolean perfilObligenAIS, final String supPeopleSoft,
			final String supApellido, final String supNombre);

	public List<KYCPendiente> getKYCPendienteList(final Integer cache,
			final String estadoKYC, final String profileKey,
			final String peopleSoft);

	public KYCSetResp setKYCPendiente(final Integer cache,
			final Long numeroCUIL, final String tipoOperacion,
			final String estadoKYC, final String profileKey,
			final String peopleSoft, final String lName, final String fName,
			final Double primaAnual, final Integer categCliente,
			final String categCGS, final String comentario);

}
