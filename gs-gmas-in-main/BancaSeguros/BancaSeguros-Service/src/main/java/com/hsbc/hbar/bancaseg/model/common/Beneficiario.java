/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.model.common;

public class Beneficiario {
	private Integer orden;
	private String nombre;
	private String tipDoc;
	private String nroDoc;
	private Double porcentaje;

	public Integer getOrden() {
		return this.orden;
	}

	public void setOrden(final Integer orden) {
		this.orden = orden;
	}

	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(final String nombre) {
		this.nombre = nombre;
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

	public Double getPorcentaje() {
		return this.porcentaje;
	}

	public void setPorcentaje(final Double porcentaje) {
		this.porcentaje = porcentaje;
	}

}
