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

public class KYCPendiente {
	private EstadoKYC estadoKYC;
	private String peopleSoft;
	private String lName;
	private String fName;
	private Integer ultFecha;
	private String tipoPersona;
	private Long numeroCUIL;
	private String apellido;
	private String nombre;
	private Double primaAnual;
	private Integer categCliente; // PPCR_2015-00142_(ENS)
	private String descCategCli; // PPCR_2015-00142_(ENS)

	public EstadoKYC getEstadoKYC() {
		return this.estadoKYC;
	}

	public void setEstadoKYC(final EstadoKYC estadoKYC) {
		this.estadoKYC = estadoKYC;
	}

	public String getPeopleSoft() {
		return this.peopleSoft;
	}

	public void setPeopleSoft(final String peopleSoft) {
		this.peopleSoft = peopleSoft;
	}

	public String getlName() {
		return this.lName;
	}

	public void setlName(final String lName) {
		this.lName = lName;
	}

	public String getfName() {
		return this.fName;
	}

	public void setfName(final String fName) {
		this.fName = fName;
	}

	public Integer getUltFecha() {
		return this.ultFecha;
	}

	public void setUltFecha(final Integer ultFecha) {
		this.ultFecha = ultFecha;
	}

	public String getTipoPersona() {
		return this.tipoPersona;
	}

	public void setTipoPersona(final String tipoPersona) {
		this.tipoPersona = tipoPersona;
	}

	public Long getNumeroCUIL() {
		return this.numeroCUIL;
	}

	public void setNumeroCUIL(final Long numeroCUIL) {
		this.numeroCUIL = numeroCUIL;
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

	public Double getPrimaAnual() {
		return this.primaAnual;
	}

	public void setPrimaAnual(final Double primaAnual) {
		this.primaAnual = primaAnual;
	}

	public Integer getCategCliente() {
		return this.categCliente;
	}

	public void setCategCliente(final Integer categCliente) {
		this.categCliente = categCliente;
	}

	public String getDescCategCli() {
		return this.descCategCli;
	}

	public void setDescCategCli(final String descCategCli) {
		this.descCategCli = descCategCli;
	}

}
