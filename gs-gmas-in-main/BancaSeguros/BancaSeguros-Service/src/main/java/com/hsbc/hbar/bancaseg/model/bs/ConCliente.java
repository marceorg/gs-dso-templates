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

public class ConCliente {
	private Compania compania;
	private String poliza;
	private Integer endoso;
	private String tomador;
	private String estado;
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

	public String getEstado() {
		return this.estado;
	}

	public void setEstado(final String estado) {
		this.estado = estado;
	}

	public Compania getCompania() {
		return this.compania;
	}

	public void setCompania(final Compania compania) {
		this.compania = compania;
	}

	public String getProducto() {
		return this.producto;
	}

	public void setProducto(final String producto) {
		this.producto = producto;
	}
}
