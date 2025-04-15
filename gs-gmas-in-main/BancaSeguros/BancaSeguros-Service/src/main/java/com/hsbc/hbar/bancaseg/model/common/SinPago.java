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

public class SinPago {
	private String detalle;
	private String beneficiario;
	private Double importe;
	private Integer fechaPago;

	public String getDetalle() {
		return this.detalle;
	}

	public void setDetalle(final String detalle) {
		this.detalle = detalle;
	}

	public String getBeneficiario() {
		return this.beneficiario;
	}

	public void setBeneficiario(final String beneficiario) {
		this.beneficiario = beneficiario;
	}

	public Double getImporte() {
		return this.importe;
	}

	public void setImporte(final Double importe) {
		this.importe = importe;
	}

	public Integer getFechaPago() {
		return this.fechaPago;
	}

	public void setFechaPago(final Integer fechaPago) {
		this.fechaPago = fechaPago;
	}

}
