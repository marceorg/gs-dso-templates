/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.publicins.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.hsbc.hbar.publicins.dao.PublicadorDao;
import com.hsbc.hbar.publicins.model.pub.Banner;
import com.hsbc.hbar.publicins.model.pub.Destacado;
import com.hsbc.hbar.publicins.model.pub.Sitio;
import com.hsbc.hbar.publicins.model.pub.TAcceso;
import com.hsbc.hbar.publicins.service.PublicadorService;
import com.hsbc.hbar.publicins.service.utils.UtilFormat;

public class PublicadorServiceImpl implements PublicadorService {
	private PublicadorDao publicadorDao;

	public PublicadorDao getPublicadorDao() {
		if (this.publicadorDao == null) {
			this.publicadorDao = (PublicadorDao) ServiceFactory.getContext().getBean("PublicadorDao");
		}
		return this.publicadorDao;
	}

	public void setPublicadorDao(final PublicadorDao publicadorDao) {
		this.publicadorDao = publicadorDao;
	}

	public Integer getFechaHoy(final Integer cache) {
		Date date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
		String dateString = formatter.format(date);
		return Integer.parseInt(dateString);
	}

	public List<Sitio> getSitioList(final Integer cache) {
		return this.getPublicadorDao().getSitioList();
	}

	public String setSitio(final HttpServletRequest httpServletRequest, final Integer cache, final Integer id,
			final String nombre, final String url) {
		String usuario = httpServletRequest.getUserPrincipal().getName();
		return this.getPublicadorDao().setSitio(id, UtilFormat.getValChars(nombre), UtilFormat.getValChars(url), usuario);
	}

	public List<Destacado> getDestacadoList(final Integer cache, final Integer id, final String traerVencidas) {
		return this.getPublicadorDao().getDestacadoList(id, traerVencidas);
	}

	public String setDestacado(final HttpServletRequest httpServletRequest, final Integer cache, final Integer id,
			final String titulo, final String subtitulo, final String descripcion, final String imagen,
			final Integer fechaDesde, final Integer fechaHasta, final Integer rotacion, final Integer publicar) {
		String usuario = httpServletRequest.getUserPrincipal().getName();
		return this.getPublicadorDao().setDestacado(id, UtilFormat.getValChars(titulo), UtilFormat.getValChars(subtitulo),
				UtilFormat.getValChars(descripcion), UtilFormat.getValChars(imagen), fechaDesde, fechaHasta, rotacion,
				publicar, usuario);
	}

	public List<Sitio> getSitioXDestacadoList(final Integer cache, final Integer id) {
		return this.getPublicadorDao().getSitioXDestacadoList(id);
	}

	public String setSitioXDestacado(final HttpServletRequest httpServletRequest, final Integer cache, final Integer idRel,
			final Integer idSitio, final Integer idDestacado) {
		String usuario = httpServletRequest.getUserPrincipal().getName();
		return this.getPublicadorDao().setSitioXDestacado(idRel, idSitio, idDestacado, usuario);
	}

	public List<Banner> getBannerList(final Integer cache, final Integer id, final String traerVencidas) {
		return this.getPublicadorDao().getBannerList(id, traerVencidas);
	}

	public String setBanner(final HttpServletRequest httpServletRequest, final Integer cache, final Integer id,
			final String titulo, final String imagen, final Integer linkTiene, final Integer linkRelDestacado,
			final Integer linkIdDestacado, final String linkURL, final Integer popUpTiene, final String popUpScrollbar,
			final String popUpToolbar, final String popUpResizable, final Integer popUpWidth, final Integer popUpHeight,
			final Integer popUpTop, final Integer popUpLeft, final Integer ubicacion, final Integer orden,
			final Integer fechaDesde, final Integer fechaHasta, final Integer publicar) {
		String usuario = httpServletRequest.getUserPrincipal().getName();
		return this.getPublicadorDao().setBanner(id, UtilFormat.getValChars(titulo), UtilFormat.getValChars(imagen),
				linkTiene, linkRelDestacado, linkIdDestacado, UtilFormat.getValChars(linkURL), popUpTiene, popUpScrollbar,
				popUpToolbar, popUpResizable, popUpWidth, popUpHeight, popUpTop, popUpLeft, ubicacion, orden, fechaDesde,
				fechaHasta, publicar, usuario);
	}

	public List<Sitio> getSitioXBannerList(final Integer cache, final Integer id) {
		return this.getPublicadorDao().getSitioXBannerList(id);
	}

	public String setSitioXBanner(final HttpServletRequest httpServletRequest, final Integer cache, final Integer idRel,
			final Integer idSitio, final Integer idBanner) {
		String usuario = httpServletRequest.getUserPrincipal().getName();
		return this.getPublicadorDao().setSitioXBanner(idRel, idSitio, idBanner, usuario);
	}

	public List<TAcceso> getTAccesoList(final Integer cache, final Integer id) {
		return this.getPublicadorDao().getTAccesoList(id);
	}

	public String setTAcceso(final HttpServletRequest httpServletRequest, final Integer cache, final Integer id,
			final String nombre, final String tipo, final Integer idSitio) {
		String usuario = httpServletRequest.getUserPrincipal().getName();
		return this.getPublicadorDao().setTAcceso(id, UtilFormat.getValChars(nombre), tipo, idSitio, usuario);
	}
}