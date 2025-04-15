/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.dao;

import java.util.List;

import com.hsbc.hbar.kycseg.model.common.Actividad;
import com.hsbc.hbar.kycseg.model.common.AuthorizedUser;
import com.hsbc.hbar.kycseg.model.common.Caracter;
import com.hsbc.hbar.kycseg.model.common.CondicionIVA;
import com.hsbc.hbar.kycseg.model.common.Pais;
import com.hsbc.hbar.kycseg.model.common.Provincia;
import com.hsbc.hbar.kycseg.model.common.TipoDoc;
import com.hsbc.hbar.kycseg.model.kyc.EstadoKYC;

public interface ParametersDao {
	public List<Provincia> getProvinciaList();

	public List<TipoDoc> getTipoDocList();

	public List<CondicionIVA> getCondicionIVAList();

	public List<Caracter> getCaracterList();

	public List<Pais> getPaisList();

	public List<Actividad> getActividadList(final String filtroAct);

	public List<AuthorizedUser> getUserList(final String profileKey);

	public List<EstadoKYC> getEstadoKYCList(final String codigo);

	public String getParamGral(final String param);
}
