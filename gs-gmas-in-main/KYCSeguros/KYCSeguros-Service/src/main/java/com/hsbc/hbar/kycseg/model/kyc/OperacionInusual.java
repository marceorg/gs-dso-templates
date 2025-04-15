/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.model.kyc;

public class OperacionInusual {
	private Integer secuencia;
	private Integer fecha;
	private String tipoOperacion;
	private String origenFondos;
	private Double monto;
	private String observacion;

	public Integer getSecuencia() {
		return this.secuencia;
	}

	public void setSecuencia(final Integer secuencia) {
		this.secuencia = secuencia;
	}

	public Integer getFecha() {
		return this.fecha;
	}

	public void setFecha(final Integer fecha) {
		this.fecha = fecha;
	}

	public String getTipoOperacion() {
		return this.tipoOperacion;
	}

	public void setTipoOperacion(final String tipoOperacion) {
		this.tipoOperacion = tipoOperacion;
	}

	public String getOrigenFondos() {
		return this.origenFondos;
	}

	public void setOrigenFondos(final String origenFondos) {
		this.origenFondos = origenFondos;
	}

	public Double getMonto() {
		return this.monto;
	}

	public void setMonto(final Double monto) {
		this.monto = monto;
	}

	public String getObservacion() {
		return this.observacion;
	}

	public void setObservacion(final String observacion) {
		this.observacion = observacion;
	}
}
