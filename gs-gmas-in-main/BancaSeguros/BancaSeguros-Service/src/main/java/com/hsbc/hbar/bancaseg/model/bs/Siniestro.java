/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.model.bs;

import java.util.List;

import com.hsbc.hbar.bancaseg.model.common.SinCobertura;
import com.hsbc.hbar.bancaseg.model.common.SinDetalle;
import com.hsbc.hbar.bancaseg.model.common.SinEstado;
import com.hsbc.hbar.bancaseg.model.common.SinPago;

public class Siniestro {
	private String poliza;
	private String tomador;
	private String tipDoc;
	private String nroDoc;
	private Integer vigenciaDesde;
	private Integer vigenciaHasta;
	private Long orden;
	private Integer fechaRegistracion;
	private Integer fechaComunicacion;
	private Integer fechaSiniestro;
	private String lugar;
	private String causa;
	private List<SinCobertura> sinCoberturaList;
	private String estado;
	private Integer fechaEstado;
	private List<SinDetalle> sinDetalleList;
	private List<SinEstado> sinEstadoList;
	private List<SinPago> sinPagoList;

	public String getPoliza() {
		return this.poliza;
	}

	public void setPoliza(final String poliza) {
		this.poliza = poliza;
	}

	public String getTomador() {
		return this.tomador;
	}

	public void setTomador(final String tomador) {
		this.tomador = tomador;
	}

	public Integer getVigenciaDesde() {
		return this.vigenciaDesde;
	}

	public void setVigenciaDesde(final Integer vigenciaDesde) {
		this.vigenciaDesde = vigenciaDesde;
	}

	public Integer getVigenciaHasta() {
		return this.vigenciaHasta;
	}

	public void setVigenciaHasta(final Integer vigenciaHasta) {
		this.vigenciaHasta = vigenciaHasta;
	}

	public Long getOrden() {
		return this.orden;
	}

	public void setOrden(final Long orden) {
		this.orden = orden;
	}

	public Integer getFechaRegistracion() {
		return this.fechaRegistracion;
	}

	public void setFechaRegistracion(final Integer fechaRegistracion) {
		this.fechaRegistracion = fechaRegistracion;
	}

	public Integer getFechaComunicacion() {
		return this.fechaComunicacion;
	}

	public void setFechaComunicacion(final Integer fechaComunicacion) {
		this.fechaComunicacion = fechaComunicacion;
	}

	public Integer getFechaSiniestro() {
		return this.fechaSiniestro;
	}

	public void setFechaSiniestro(final Integer fechaSiniestro) {
		this.fechaSiniestro = fechaSiniestro;
	}

	public String getLugar() {
		return this.lugar;
	}

	public void setLugar(final String lugar) {
		this.lugar = lugar;
	}

	public String getCausa() {
		return this.causa;
	}

	public void setCausa(final String causa) {
		this.causa = causa;
	}

	public List<SinCobertura> getSinCoberturaList() {
		return this.sinCoberturaList;
	}

	public void setSinCoberturaList(final List<SinCobertura> sinCoberturaList) {
		this.sinCoberturaList = sinCoberturaList;
	}

	public String getEstado() {
		return this.estado;
	}

	public void setEstado(final String estado) {
		this.estado = estado;
	}

	public Integer getFechaEstado() {
		return this.fechaEstado;
	}

	public void setFechaEstado(final Integer fechaEstado) {
		this.fechaEstado = fechaEstado;
	}

	public List<SinDetalle> getSinDetalleList() {
		return this.sinDetalleList;
	}

	public void setSinDetalleList(final List<SinDetalle> sinDetalleList) {
		this.sinDetalleList = sinDetalleList;
	}

	public List<SinEstado> getSinEstadoList() {
		return this.sinEstadoList;
	}

	public void setSinEstadoList(final List<SinEstado> sinEstadoList) {
		this.sinEstadoList = sinEstadoList;
	}

	public List<SinPago> getSinPagoList() {
		return this.sinPagoList;
	}

	public void setSinPagoList(final List<SinPago> sinPagoList) {
		this.sinPagoList = sinPagoList;
	}

	public String getTipDoc() {
		return this.tipDoc;
	}

	public void setTipDoc(final String tipDoc) {
		this.tipDoc = tipDoc;
	}

	public String getNroDoc() {
		return this.nroDoc;
	}

	public void setNroDoc(final String nroDoc) {
		this.nroDoc = nroDoc;
	}

}
