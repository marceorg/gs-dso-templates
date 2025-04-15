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

import com.hsbc.hbar.bancaseg.model.common.Compania;

public class OpeEmitida {
	private Compania compania;
	private String poliza;
	private Integer endoso;
	private String tomador;
	private Integer vigenciaDesde;
	private Integer vigenciaHasta;
	private Integer fechaEmision;
	private Double prima;
	private Double precio;
	private String motivo;
	private String producto;

	public String getPoliza() {
		return this.poliza;
	}

	public void setPoliza(final String poliza) {
		this.poliza = poliza;
	}

	public Integer getEndoso() {
		return this.endoso;
	}

	public void setEndoso(final Integer endoso) {
		this.endoso = endoso;
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

	public Integer getFechaEmision() {
		return this.fechaEmision;
	}

	public void setFechaEmision(final Integer fechaEmision) {
		this.fechaEmision = fechaEmision;
	}

	public Double getPrima() {
		return this.prima;
	}

	public void setPrima(final Double prima) {
		this.prima = prima;
	}

	public Double getPrecio() {
		return this.precio;
	}

	public void setPrecio(final Double precio) {
		this.precio = precio;
	}

	public Compania getCompania() {
		return this.compania;
	}

	public void setCompania(final Compania compania) {
		this.compania = compania;
	}

	public String getMotivo() {
		return this.motivo;
	}

	public void setMotivo(final String motivo) {
		this.motivo = motivo;
	}

	public String getProducto() {
		return this.producto;
	}

	public void setProducto(final String producto) {
		this.producto = producto;
	}
}
