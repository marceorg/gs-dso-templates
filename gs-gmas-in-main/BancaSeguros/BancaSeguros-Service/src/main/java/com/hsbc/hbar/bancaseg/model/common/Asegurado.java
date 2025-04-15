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

public class Asegurado {
	private String nombre;
	private String tipDoc;
	private String nroDoc;
	private String domicilio;
	private String codPost;
	private String localidad;
	private String provincia;

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

	public String getDomicilio() {
		return this.domicilio;
	}

	public void setDomicilio(final String domicilio) {
		this.domicilio = domicilio;
	}

	public String getCodPost() {
		return this.codPost;
	}

	public void setCodPost(final String codPost) {
		this.codPost = codPost;
	}

	public String getLocalidad() {
		return this.localidad;
	}

	public void setLocalidad(final String localidad) {
		this.localidad = localidad;
	}

	public String getProvincia() {
		return this.provincia;
	}

	public void setProvincia(final String provincia) {
		this.provincia = provincia;
	}

}
