package com.hsbc.hbar.publicins.model.pub;

public class Banner {
	private Integer id;
	private String titulo;
	private String imagen;
	private Integer linkTiene;
	private Integer linkRelDestacado;
	private Integer linkIdDestacado;
	private String linkURL;
	private Integer popUpTiene;
	private String popUpScrollbar;
	private String popUpToolbar;
	private String popUpResizable;
	private Integer popUpWidth;
	private Integer popUpHeight;
	private Integer popUpTop;
	private Integer popUpLeft;
	private Integer ubicacion;
	private Integer orden;
	private Integer fechaAlta;
	private Integer fechaDesde;
	private Integer fechaHasta;
	private Integer fechaBaja;
	private Integer publicar;
	private String usuario;
	private Integer cantSitios;

	public Banner(final Integer id, final String titulo, final String imagen,
			final Integer linkTiene, final Integer linkRelDestacado,
			final Integer linkIdDestacado, final String linkURL,
			final Integer popUpTiene, final String popUpScrollbar,
			final String popUpToolbar, final String popUpResizable,
			final Integer popUpWidth, final Integer popUpHeight,
			final Integer popUpTop, final Integer popUpLeft,
			final Integer ubicacion, final Integer orden,
			final Integer fechaAlta, final Integer fechaDesde,
			final Integer fechaHasta, final Integer fechaBaja,
			final Integer publicar, final String usuario,
			final Integer cantSitios) {
		super();
		this.id = id;
		this.titulo = titulo;
		this.imagen = imagen;
		this.linkTiene = linkTiene;
		this.linkRelDestacado = linkRelDestacado;
		this.linkIdDestacado = linkIdDestacado;
		this.linkURL = linkURL;
		this.popUpTiene = popUpTiene;
		this.popUpScrollbar = popUpScrollbar;
		this.popUpToolbar = popUpToolbar;
		this.popUpResizable = popUpResizable;
		this.popUpWidth = popUpWidth;
		this.popUpHeight = popUpHeight;
		this.popUpTop = popUpTop;
		this.popUpLeft = popUpLeft;
		this.ubicacion = ubicacion;
		this.orden = orden;
		this.fechaAlta = fechaAlta;
		this.fechaDesde = fechaDesde;
		this.fechaHasta = fechaHasta;
		this.fechaBaja = fechaBaja;
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

	public String getImagen() {
		return this.imagen;
	}

	public void setImagen(final String imagen) {
		this.imagen = imagen;
	}

	public Integer getLinkTiene() {
		return this.linkTiene;
	}

	public void setLinkTiene(final Integer linkTiene) {
		this.linkTiene = linkTiene;
	}

	public Integer getLinkRelDestacado() {
		return this.linkRelDestacado;
	}

	public void setLinkRelDestacado(final Integer linkRelDestacado) {
		this.linkRelDestacado = linkRelDestacado;
	}

	public Integer getLinkIdDestacado() {
		return this.linkIdDestacado;
	}

	public void setLinkIdDestacado(final Integer linkIdDestacado) {
		this.linkIdDestacado = linkIdDestacado;
	}

	public String getLinkURL() {
		return this.linkURL;
	}

	public void setLinkURL(final String linkURL) {
		this.linkURL = linkURL;
	}

	public Integer getPopUpTiene() {
		return this.popUpTiene;
	}

	public void setPopUpTiene(final Integer popUpTiene) {
		this.popUpTiene = popUpTiene;
	}

	public String getPopUpScrollbar() {
		return this.popUpScrollbar;
	}

	public void setPopUpScrollbar(final String popUpScrollbar) {
		this.popUpScrollbar = popUpScrollbar;
	}

	public String getPopUpToolbar() {
		return this.popUpToolbar;
	}

	public void setPopUpToolbar(final String popUpToolbar) {
		this.popUpToolbar = popUpToolbar;
	}

	public String getPopUpResizable() {
		return this.popUpResizable;
	}

	public void setPopUpResizable(final String popUpResizable) {
		this.popUpResizable = popUpResizable;
	}

	public Integer getPopUpWidth() {
		return this.popUpWidth;
	}

	public void setPopUpWidth(final Integer popUpWidth) {
		this.popUpWidth = popUpWidth;
	}

	public Integer getPopUpHeight() {
		return this.popUpHeight;
	}

	public void setPopUpHeight(final Integer popUpHeight) {
		this.popUpHeight = popUpHeight;
	}

	public Integer getPopUpTop() {
		return this.popUpTop;
	}

	public void setPopUpTop(final Integer popUpTop) {
		this.popUpTop = popUpTop;
	}

	public Integer getPopUpLeft() {
		return this.popUpLeft;
	}

	public void setPopUpLeft(final Integer popUpLeft) {
		this.popUpLeft = popUpLeft;
	}

	public Integer getUbicacion() {
		return this.ubicacion;
	}

	public void setUbicacion(final Integer ubicacion) {
		this.ubicacion = ubicacion;
	}

	public Integer getOrden() {
		return this.orden;
	}

	public void setOrden(final Integer orden) {
		this.orden = orden;
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
