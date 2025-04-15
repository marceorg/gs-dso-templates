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

import java.util.List;

import com.hsbc.hbar.bancaseg.model.common.Contacto;

public class Cliente {
	private String tomador;
	private String tipDoc;
	private String nroDoc;
	private String sexo;
	private Integer fechaNacimiento;
	private String nacionalidad;
	private String estadoCivil;
	private String domicilio;
	private String codPost;
	private String localidad;
	private String provincia;
	private List<Contacto> contactoList;

	public String getSexo() {
		return this.sexo;
	}

	public void setSexo(final String sexo) {
		this.sexo = sexo;
	}

	public Integer getFechaNacimiento() {
		return this.fechaNacimiento;
	}

	public void setFechaNacimiento(final Integer fechaNacimiento) {
		this.fechaNacimiento = fechaNacimiento;
	}

	public String getNacionalidad() {
		return this.nacionalidad;
	}

	public void setNacionalidad(final String nacionalidad) {
		this.nacionalidad = nacionalidad;
	}

	public String getEstadoCivil() {
		return this.estadoCivil;
	}

	public void setEstadoCivil(final String estadoCivil) {
		this.estadoCivil = estadoCivil;
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

	public List<Contacto> getContactoList() {
		return this.contactoList;
	}

	public void setContactoList(final List<Contacto> contactoList) {
		this.contactoList = contactoList;
	}

}
