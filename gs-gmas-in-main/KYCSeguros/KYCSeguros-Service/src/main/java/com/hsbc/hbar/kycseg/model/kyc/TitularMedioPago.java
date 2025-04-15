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

import com.hsbc.hbar.kycseg.model.common.TipoDoc;

public class TitularMedioPago {
	private TipoDoc tipoDoc;
	private Long numeroDoc;
	private String apellido;
	private String nombre;
	private String medioPago;

	public TipoDoc getTipoDoc() {
		return this.tipoDoc;
	}

	public void setTipoDoc(final TipoDoc tipoDoc) {
		this.tipoDoc = tipoDoc;
	}

	public Long getNumeroDoc() {
		return this.numeroDoc;
	}

	public void setNumeroDoc(final Long numeroDoc) {
		this.numeroDoc = numeroDoc;
	}

	public String getApellido() {
		return this.apellido;
	}

	public void setApellido(final String apellido) {
		this.apellido = apellido;
	}

	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(final String nombre) {
		this.nombre = nombre;
	}

	public String getMedioPago() {
		return this.medioPago;
	}

	public void setMedioPago(final String medioPago) {
		this.medioPago = medioPago;
	}
}
