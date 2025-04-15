package com.hsbc.hbar.publicins.model.pub;

public class Destacado {
	private Integer id;
	private String titulo;
	private String subtitulo;
	private String descripcion;
	private String imagen;
	private Integer fechaAlta;
	private Integer fechaDesde;
	private Integer fechaHasta;
	private Integer fechaBaja;
	private Integer rotacion;
	private Integer publicar;
	private String usuario;
	private Integer cantSitios;

	public Destacado(final Integer id, final String titulo,
			final String subtitulo, final String descripcion,
			final String imagen, final Integer fechaAlta,
			final Integer fechaDesde, final Integer fechaHasta,
			final Integer fechaBaja, final Integer rotacion,
			final Integer publicar, final String usuario,
			final Integer cantSitios) {
		super();
		this.id = id;
		this.titulo = titulo;
		this.subtitulo = subtitulo;
		this.descripcion = descripcion;
		this.imagen = imagen;
		this.fechaAlta = fechaAlta;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
		this.fechaBaja = fechaBaja;
		this.rotacion = rotacion;
		this.publicar = publicar;
		this.usuario = usuario;
		this.cantSitios = cantSitios;
	}

	public Integer getId() {
		return this.id;
	}

	public void setId(final Integer id) {
		this.id = id;
	}

	public String getTitulo() {
		return this.titulo;
	}

	public void setTitulo(final String titulo) {
		this.titulo = titulo;
	}

	public String getSubtitulo() {
		return this.subtitulo;
	}

	public void setSubtitulo(final String subtitulo) {
		this.subtitulo = subtitulo;
	}

	public String getDescripcion() {
		return this.descripcion;
	}

	public void setDescripcion(final String descripcion) {
		this.descripcion = descripcion;
	}

	public String getImagen() {
		return this.imagen;
	}

	public void setImagen(final String imagen) {
		this.imagen = imagen;
	}

	public Integer getFechaAlta() {
		return this.fechaAlta;
	}

	public void setFechaAlta(final Integer fechaAlta) {
		this.fechaAlta = fechaAlta;
	}

	public Integer getFechaDesde() {
		return this.fechaDesde;
	}

	public void setFechaDesde(final Integer fechaDesde) {
		this.fechaDesde = fechaDesde;
	}

	public Integer getFechaHasta() {
		return this.fechaHasta;
	}

	public void setFechaHasta(final Integer fechaHasta) {
		this.fechaHasta = fechaHasta;
	}

	public Integer getFechaBaja() {
		return this.fechaBaja;
	}

	public void setFechaBaja(final Integer fechaBaja) {
		this.fechaBaja = fechaBaja;
	}

	public Integer getRotacion() {
		return this.rotacion;
	}

	public void setRotacion(final Integer rotacion) {
		this.rotacion = rotacion;
	}

	public Integer getPublicar() {
		return this.publicar;
	}

	public void setPublicar(final Integer publicar) {
		this.publicar = publicar;
	}

	public String getUsuario() {
		return this.usuario;
	}

	public void setUsuario(final String usuario) {
		this.usuario = usuario;
	}

	public Integer getCantSitios() {
		return this.cantSitios;
	}

	public void setCantSitios(final Integer cantSitios) {
		this.cantSitios = cantSitios;
	}
}
