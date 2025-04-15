/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.service;

import java.util.List;

import com.hsbc.hbar.kycseg.model.common.Actividad;
import com.hsbc.hbar.kycseg.model.common.AuthorizedUser;
import com.hsbc.hbar.kycseg.model.common.CategoriaGS;
import com.hsbc.hbar.kycseg.model.common.Pais;
import com.hsbc.hbar.kycseg.model.kyc.KYCPendiente;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersFis;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersJur;
import com.hsbc.hbar.kycseg.model.kyc.KYCSetResp;

public interface JMSCommService {
	public List<Pais> getPaisList();

	public List<Actividad> getActividadList(final String filtroAct);

	public KYCPersFis getKYCPersFis(final Integer nroLlamada, final Long numeroCUIL, final String apellido,
			final String nombre);

	public KYCSetResp setKYCPersFis(final KYCPersFis kycPersFis, final String tipoOperacion, final Boolean actPerfilTrans,
			final Boolean esKYCNuevo, final Integer vigenciaDesde, final Integer vigenciaHasta,
			final Boolean perfilObligenAIS, final AuthorizedUser operador, final AuthorizedUser supervisor);

	public KYCPersJur getKYCPersJur(final Integer nroLlamada, final Long numeroCUIT, final String razonSocial);

	public KYCSetResp setKYCPersJur(final KYCPersJur kycPersJur, final String tipoOperacion, final Boolean actPerfilTrans,
			final Boolean esKYCNuevo, final Integer vigenciaDesde, final Integer vigenciaHasta,
			final Boolean perfilObligenAIS, final AuthorizedUser operador, final AuthorizedUser supervisor);

	public List<KYCPendiente> getKYCPendienteList(final String estadoKYC, final String profileKey, final String peopleSoft);

	public KYCSetResp setKYCPendiente(final Long numeroCUIL, final String tipoOperacion, final String estadoKYC,
			final AuthorizedUser user, final Double primaAnual, final Integer categCliente, final String categCGS,
			final String comentario);

	public List<CategoriaGS> getCategoriasGSList(final Integer categoriaAIS);

}
