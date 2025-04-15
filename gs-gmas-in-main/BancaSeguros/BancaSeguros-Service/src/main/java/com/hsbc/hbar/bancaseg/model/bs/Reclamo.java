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

public class Reclamo {
	private Long orden;
	private String compania;
	private String producto;
	private String poliza;
	private Integer endoso;
	private String tomador;
	private String tipDoc;
	private String nroDoc;
	private Integer fechaPedido;
	private String tipReg;
	private String motRec;
	private String descRec;
	private String telefono;
	private String email;
	private String peopleSoft;

	public Long getOrden() {
		return this.orden;
	}

	public void setOrden(final Long orden) {
		this.orden = orden;
	}

	public String getCompania() {
		return this.compania;
	}

	public void setCompania(final String compania) {
		this.compania = compania;
	}

	public String getProducto() {
		return this.producto;
	}

	public void setProducto(final String producto) {
		this.producto = producto;
	}

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

	public Integer getFechaPedido() {
		return this.fechaPedido;
	}

	public void setFechaPedido(final Integer fechaPedido) {
		this.fechaPedido = fechaPedido;
	}

	public String getTipReg() {
		return this.tipReg;
	}

	public void setTipReg(final String tipReg) {
		this.tipReg = tipReg;
	}

	public String getMotRec() {
		return this.motRec;
	}

	public void setMotRec(final String motRec) {
		this.motRec = motRec;
	}

	public String getDescRec() {
		return this.descRec;
	}

	public void setDescRec(final String descRec) {
		this.descRec = descRec;
	}

	public String getTelefono() {
		return this.telefono;
	}

	public void setTelefono(final String telefono) {
		this.telefono = telefono;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(final String email) {
		this.email = email;
	}

	public String getPeopleSoft() {
		return this.peopleSoft;
	}

	public void setPeopleSoft(final String peopleSoft) {
		this.peopleSoft = peopleSoft;
	}

}
