/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2016. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.publicins.model.pub;

public class Sitio {
	private Integer id;
	private String nombre;
	private String url;
	private Integer fechaAlta;
	private Integer fechaBaja;
	private String usuario;

	public Sitio(final Integer id, final String nombre, final String url,
			final Integer fechaAlta, final Integer fechaBaja,
			final String usuario) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.url = url;
		this.fechaAlta = fechaAlta;
		this.fechaBaja = fechaBaja;
		this.usuario = usuario;
	}

	public Integer getId() {
		return this.id;
	}

	public void setId(final Integer id) {
		this.id = id;
	}

	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(final String nombre) {
		this.nombre = nombre;
	}

	public String getUrl() {
		return this.url;
	}

	public void setUrl(final String url) {
		this.url = url;
	}

	public Integer getFechaAlta() {
		return this.fechaAlta;
	}

	public void setFechaAlta(final Integer fechaAlta) {
		this.fechaAlta = fechaAlta;
	}

	public Integer getFechaBaja() {
		return this.fechaBaja;
	}

	public void setFechaBaja(final Integer fechaBaja) {
		this.fechaBaja = fechaBaja;
	}

	public String getUsuario() {
		return this.usuario;
	}

	public void setUsuario(final String usuario) {
		this.usuario = usuario;
	}
}
