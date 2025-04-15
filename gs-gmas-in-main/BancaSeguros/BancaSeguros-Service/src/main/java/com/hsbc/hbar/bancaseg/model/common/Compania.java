/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.model.common;

public class Compania {
	private Integer id;
	private String name;
	private String email;
	private String ejePoliza;
	private String ejeSiniestro;
	private String recemail;

	public Integer getId() {
		return this.id;
	}

	public void setId(final Integer id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(final String email) {
		this.email = email;
	}

	public String getEjePoliza() {
		return this.ejePoliza;
	}

	public void setEjePoliza(final String ejePoliza) {
		this.ejePoliza = ejePoliza;
	}

	public String getEjeSiniestro() {
		return this.ejeSiniestro;
	}

	public void setEjeSiniestro(final String ejeSiniestro) {
		this.ejeSiniestro = ejeSiniestro;
	}

	public String getRecemail() {
		return this.recemail;
	}

	public void setRecemail(final String recemail) {
		this.recemail = recemail;
	}
}
