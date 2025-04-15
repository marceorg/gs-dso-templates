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

import com.hsbc.hbar.bancaseg.model.bs.Cliente;
import com.hsbc.hbar.bancaseg.model.bs.ConClienteInf;
import com.hsbc.hbar.bancaseg.model.bs.ConEndoso;
import com.hsbc.hbar.bancaseg.model.bs.ConSiniestroInf;
import com.hsbc.hbar.bancaseg.model.bs.Denuncia;
import com.hsbc.hbar.bancaseg.model.bs.OpeEmitidaInf;
import com.hsbc.hbar.bancaseg.model.bs.OpeSiniestroInf;
import com.hsbc.hbar.bancaseg.model.bs.Poliza;
import com.hsbc.hbar.bancaseg.model.bs.ResMensajeGen;
import com.hsbc.hbar.bancaseg.model.bs.Siniestro;

public interface BSService {
	public OpeEmitidaInf getOpeEmitidaList(final Integer cache, final Integer fechaDesde, final Integer fechaHasta,
			final Integer compania, final String producto, final String paramStart);

	public ConClienteInf getConClienteList(final Integer cache, final String tipoBusqueda, final Integer tipDoc,
			final String nroDoc, final String apellido, final Integer compania, final String poliza, final String paramStart);

	public Cliente getConCliente(final Integer cache, final Integer compania, final String poliza);

	public Poliza getConPoliza(final Integer cache, final Integer compania, final String poliza, final Integer endoso);

	public ConEndoso getConEndoso(final Integer cache, final Integer compania, final String poliza,
			final Integer fechaDesde, final Integer fechaHasta);

	public ConSiniestroInf getConSiniestroList(final Integer cache, final String tipoBusqueda, final Integer tipDoc,
			final String nroDoc, final String apellido, final String poliza, final String siniestro, final Long orden,
			final Integer compania, final String estado, final Integer fechaDesde, final Integer fechaHasta,
			final String paramStart);

	public Siniestro getConSiniestro(final Integer cache, final Integer compania, final String siniestro);

	public Denuncia getOpeSiniestro(final Integer cache, final Long orden);

	public Long setOpeSiniestro(final Integer cache, final Integer companiaId, final String productoId, final String poliza,
			final Integer endoso, final String tomador, final String tipDoc, final String nroDoc,
			final Integer fechaDenuncia, final Integer fechaSiniestro, final Boolean esDenAseg, final String denTipDoc,
			final String denNroDoc, final String denApeNom, final String denParentescoId, final String descSiniestro,
			final String datosSiniestro, final String peopleSoft, final String usuApeNom);

	public Boolean setOpeSiniestroEst(final Integer cache, final Long orden, final String estado);

	public Boolean setOpeSiniestroSendMail(final Integer cache, final Long orden, final String recipientTO,
			final Integer cantAdj);

	public OpeSiniestroInf getOpeSiniestroList(final Integer cache, final String tipoBusqueda, final Integer tipDoc,
			final String nroDoc, final String apellido, final String poliza, final Long orden, final Integer compania,
			final String estado, final Integer fechaDesde, final Integer fechaHasta, final String paramStart);

	public ResMensajeGen getConCobranza(final Integer cache, final Integer compania, final String poliza,
			final Integer fechaDesde, final Integer fechaHasta, final String paramStart);

	public ResMensajeGen getTipoReclamo(final Integer cache, final Integer compania, final String ramo);

	public ResMensajeGen getMotReclamo(final Integer cache, final Integer compania, final String ramo, final Integer tiporec);

	public ResMensajeGen setOpeReclamo(final Integer cache, final Integer companiaId, final String productoId,
			final String poliza, final Integer endoso, final String tomador, final Integer tipDoc, final String nroDoc,
			final Integer fechaPedido, final Integer tipReg, final Integer tipMot, final String descPedido,
			final String telefono, final String email, final Integer peopleSoft, final String usuApeNom);

	public ResMensajeGen setOpeReclamoEst(final Integer cache, final Long orden, final String estado);

	public ResMensajeGen getOpeReclamoList(final Integer cache, final String tipoBusqueda, final Integer tipDoc,
			final String nroDoc, final String apellido, final String poliza, final Long orden, final Integer compania,
			final String estado, final Integer fechaDesde, final Integer fechaHasta, final String paramStart);

	public ResMensajeGen getOpeReclamo(final Integer cache, final Long orden);

	public String getReclamoAdj(final Integer cache, final Long orden);

	public Boolean setOpeReclamoSendMail(final Integer cache, final Long orden, final String recipientTO,
			final Integer cantAdj, final String compania, final String producto, final String poliza, final Integer endoso,
			final String tomador, final String tipDoc, final String nroDoc, final Integer fechaPedido, final String tipReg,
			final String motRec, final String descRec, final String telefono, final String email, final String peopleSoft);

}
