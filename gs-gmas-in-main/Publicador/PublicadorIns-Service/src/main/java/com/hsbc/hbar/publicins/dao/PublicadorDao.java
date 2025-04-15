/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.publicins.dao;

import java.util.List;

import com.hsbc.hbar.publicins.model.pub.Banner;
import com.hsbc.hbar.publicins.model.pub.Destacado;
import com.hsbc.hbar.publicins.model.pub.Sitio;
import com.hsbc.hbar.publicins.model.pub.TAcceso;

public interface PublicadorDao {
	public List<Sitio> getSitioList();

	public String setSitio(final Integer id, final String nombre, final String url, final String usuario);

	public List<Destacado> getDestacadoList(final Integer id, final String traerVencidas);

	public String setDestacado(final Integer id, final String titulo, final String subtitulo, final String descripcion,
			final String imagen, final Integer fechaDesde, final Integer fechaHasta, final Integer rotacion,
			final Integer publicar, final String usuario);

	public List<Sitio> getSitioXDestacadoList(final Integer id);

	public String setSitioXDestacado(final Integer idRel, final Integer idSitio, final Integer idDestacado,
			final String usuario);

	public List<Banner> getBannerList(final Integer id, final String traerVencidas);

	public String setBanner(final Integer id, final String titulo, final String imagen, final Integer linkTiene,
			final Integer linkRelDestacado, final Integer linkIdDestacado, final String linkURL, final Integer popUpTiene,
			final String popUpScrollbar, final String popUpToolbar, final String popUpResizable, final Integer popUpWidth,
			final Integer popUpHeight, final Integer popUpTop, final Integer popUpLeft, final Integer ubicacion,
			final Integer orden, final Integer fechaDesde, final Integer fechaHasta, final Integer publicar,
			final String usuario);

	public List<Sitio> getSitioXBannerList(final Integer id);

	public String setSitioXBanner(final Integer idRel, final Integer idSitio, final Integer idBanner, final String usuario);

	public List<TAcceso> getTAccesoList(final Integer id);

	public String setTAcceso(final Integer id, final String nombre, final String tipo, final Integer idSitio,
			final String usuario);
}