/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.model.kyc;

public class Compania {
	private Integer secuencia;
	private String razonSocial;
	private Boolean EsSCC;
	private Integer fechaConstitucion;

	public Integer getSecuencia() {
		return this.secuencia;
	}

	public void setSecuencia(final Integer secuencia) {
		this.secuencia = secuencia;
	}

	public String getRazonSocial() {
		return this.razonSocial;
	}

	public void setRazonSocial(final String razonSocial) {
		this.razonSocial = razonSocial;
	}

	public Boolean getEsSCC() {
		return this.EsSCC;
	}

	public void setEsSCC(final Boolean esSCC) {
		this.EsSCC = esSCC;
	}

	public Integer getFechaConstitucion() {
		return this.fechaConstitucion;
	}

	public void setFechaConstitucion(final Integer fechaConstitucion) {
		this.fechaConstitucion = fechaConstitucion;
	}
}
