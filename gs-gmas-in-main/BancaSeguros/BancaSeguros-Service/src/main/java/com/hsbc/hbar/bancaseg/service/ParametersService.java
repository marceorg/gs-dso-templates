/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service;

import java.util.List;

import com.hsbc.hbar.bancaseg.model.common.Canal;
import com.hsbc.hbar.bancaseg.model.common.Compania;
import com.hsbc.hbar.bancaseg.model.common.DenDocReq;
import com.hsbc.hbar.bancaseg.model.common.ParSinEstado;
import com.hsbc.hbar.bancaseg.model.common.Parentesco;
import com.hsbc.hbar.bancaseg.model.common.Producto;
import com.hsbc.hbar.bancaseg.model.common.Sucursal;
import com.hsbc.hbar.bancaseg.model.common.TipoDoc;

public interface ParametersService {
	public List<Compania> getCompaniaList();

	public List<TipoDoc> getTipoDocList();

	public Integer getFechaHoy();

	public List<Producto> getProductoList(final Integer compania);

	public List<Sucursal> getSucursalList(final Integer compania);

	public List<Canal> getCanalList(final Integer compania);

	public List<ParSinEstado> getSinEstadoList();

	public List<Parentesco> getParentescoList();

	public List<DenDocReq> getDenDocReqList(final Integer compania, final String producto);

	public List<String> getLogExec(final String param);
}
