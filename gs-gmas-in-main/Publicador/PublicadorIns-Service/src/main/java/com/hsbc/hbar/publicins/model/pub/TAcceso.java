package com.hsbc.hbar.publicins.model.pub;

public class TAcceso {
	private Integer id;
	private String nombre;
	private String tipo;
	private Integer idSitio;
	private Integer fechaAlta;
	private Integer fechaBaja;
	private String usuario;

	public TAcceso(final Integer id, final String nombre, final String tipo,
			final Integer idSitio, final Integer fechaAlta,
			final Integer fechaBaja, final String usuario) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.tipo = tipo;
		this.idSitio = idSitio;
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

	public String getTipo() {
		return this.tipo;
	}

	public void setTipo(final String tipo) {
		this.tipo = tipo;
	}

	public Integer getIdSitio() {
		return this.idSitio;
	}

	public void setIdSitio(final Integer idSitio) {
		this.idSitio = idSitio;
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
