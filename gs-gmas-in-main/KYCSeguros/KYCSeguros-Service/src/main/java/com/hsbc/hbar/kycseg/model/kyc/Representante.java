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

public class Representante {
	private TipoDoc tipoDoc;
	private Integer numeroDoc;
	private String apellido;
	private String nombre;
	private Boolean EsSCC;
	private String Cargo;
	private Boolean EsPEP;
	private Integer fechaConstitNacim;

	public TipoDoc getTipoDoc() {
		return this.tipoDoc;
	}

	public void setTipoDoc(final TipoDoc tipoDoc) {
		this.tipoDoc = tipoDoc;
	}

	public Integer getNumeroDoc() {
		return this.numeroDoc;
	}

	public void setNumeroDoc(final Integer numeroDoc) {
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

	public Boolean getEsSCC() {
		return this.EsSCC;
	}

	public void setEsSCC(final Boolean esSCC) {
		this.EsSCC = esSCC;
	}

	public String getCargo() {
		return this.Cargo;
	}

	public void setCargo(final String cargo) {
		this.Cargo = cargo;
	}

	public Boolean getEsPEP() {
		return this.EsPEP;
	}

	public void setEsPEP(final Boolean esPEP) {
		this.EsPEP = esPEP;
	}

	public Integer getFechaConstitNacim() {
		return this.fechaConstitNacim;
	}

	public void setFechaConstitNacim(final Integer fechaConstitNacim) {
		this.fechaConstitNacim = fechaConstitNacim;
	}
}
