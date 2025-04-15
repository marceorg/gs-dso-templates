/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service;

import java.util.List;

import com.hsbc.hbar.bancaseg.model.bs.Cliente;
import com.hsbc.hbar.bancaseg.model.bs.ConClienteInf;
import com.hsbc.hbar.bancaseg.model.bs.ConEndoso;
import com.hsbc.hbar.bancaseg.model.bs.ConSiniestroInf;
import com.hsbc.hbar.bancaseg.model.bs.Denuncia;
import com.hsbc.hbar.bancaseg.model.bs.OpeEmitidaInf;
import com.hsbc.hbar.bancaseg.model.bs.OpeSiniestroInf;
import com.hsbc.hbar.bancaseg.model.bs.Poliza;
import com.hsbc.hbar.bancaseg.model.bs.Siniestro;
import com.hsbc.hbar.bancaseg.model.common.Canal;
import com.hsbc.hbar.bancaseg.model.common.DenDocReq;
import com.hsbc.hbar.bancaseg.model.common.Producto;
import com.hsbc.hbar.bancaseg.model.common.Sucursal;

public interface JMSCommService {
	public List<Producto> getProductoList(final Integer compania);

	public List<Sucursal> getSucursalList(final Integer compania);

	public List<Canal> getCanalList(final Integer compania);

	public List<DenDocReq> getDenDocReqList(final Integer compania, final String producto);

	public OpeEmitidaInf getOpeEmitidaList(final Integer fechaDesde, final Integer fechaHasta, final Integer compania,
			final String producto, final String paramStart);

	public ConClienteInf getConClienteList(final String tipoBusqueda, final Integer tipDoc, final String nroDoc,
			final String apellido, final Integer compania, final String poliza, final String paramStart);

	public Cliente getConCliente(final Integer compania, final String poliza);

	public Poliza getConPoliza(final Integer compania, final String poliza, final Integer endoso);

	public ConEndoso getConEndoso(final Integer compania, final String poliza, final Integer fechaDesde,
			final Integer fechaHasta);

	public ConSiniestroInf getConSiniestroList(final String tipoBusqueda, final Integer tipDoc, final String nroDoc,
			final String apellido, final String poliza, final String siniestro, final Long orden, final Integer compania,
			final String estado, final Integer fechaDesde, final Integer fechaHasta, final String paramStart);

	public Siniestro getConSiniestro(final Integer compania, final String siniestro);

	public Denuncia getOpeSiniestro(final Long orden);

	public Long setOpeSiniestro(final Denuncia denuncia);

	public Boolean setOpeSiniestroEst(final Long orden, final String estado);

	public OpeSiniestroInf getOpeSiniestroList(final String tipoBusqueda, final Integer tipDoc, final String nroDoc,
			final String apellido, final String poliza, final Long orden, final Integer compania, final String estado,
			final Integer fechaDesde, final Integer fechaHasta, final String paramStart);
}
