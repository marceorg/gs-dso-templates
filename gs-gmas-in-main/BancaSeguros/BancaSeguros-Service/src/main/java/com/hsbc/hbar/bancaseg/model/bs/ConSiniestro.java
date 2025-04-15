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

public class ConSiniestro {
	private Compania compania;
	private String poliza;
	private String tomador;
	private Long orden;
	private String siniestro;
	private Integer fechaSiniestro;
	private String estado;

	public Compania getCompania() {
		return this.compania;
	}

	public void setCompania(final Compania compania) {
		this.compania = compania;
	}

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

	public Long getOrden() {
		return this.orden;
	}

	public void setOrden(final Long orden) {
		this.orden = orden;
	}

	public String getSiniestro() {
		return this.siniestro;
	}

	public void setSiniestro(final String siniestro) {
		this.siniestro = siniestro;
	}

	public Integer getFechaSiniestro() {
		return this.fechaSiniestro;
	}

	public void setFechaSiniestro(final Integer fechaSiniestro) {
		this.fechaSiniestro = fechaSiniestro;
	}

	public String getEstado() {
		return this.estado;
	}

	public void setEstado(final String estado) {
		this.estado = estado;
	}
}
