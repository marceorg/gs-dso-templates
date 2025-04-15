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

import com.hsbc.hbar.bancaseg.model.common.Compania;
import com.hsbc.hbar.bancaseg.model.common.Parentesco;
import com.hsbc.hbar.bancaseg.model.common.Producto;

public class Denuncia {
	private Long orden;
	private Compania compania;
	private Producto producto;
	private String poliza;
	private Integer endoso;
	private String siniestro;
	private String tomador;
	private String tipDoc;
	private String nroDoc;
	private Integer fechaDenuncia;
	private Integer fechaSiniestro;
	private Boolean esDenAseg;
	private String denTipDoc;
	private String denNroDoc;
	private String denApeNom;
	private Parentesco denParentesco;
	private String descSiniestro;
	private String datosSiniestro;
	private Boolean adjunto1;
	private Boolean adjunto2;
	private Boolean adjunto3;
	private String estado;
	private String peopleSoft;
	private String usuApeNom;

	public Long getOrden() {
		return this.orden;
	}

	public void setOrden(final Long orden) {
		this.orden = orden;
	}

	public Compania getCompania() {
		return this.compania;
	}

	public void setCompania(final Compania compania) {
		this.compania = compania;
	}

	public Producto getProducto() {
		return this.producto;
	}

	public void setProducto(final Producto producto) {
		this.producto = producto;
	}

	public String getPoliza() {
		return this.poliza;
	}

	public void setPoliza(final String poliza) {
		this.poliza = poliza;
	}

	public Integer getEndoso() {
		return this.endoso;
	}

	public void setEndoso(final Integer endoso) {
		this.endoso = endoso;
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

	public Integer getFechaDenuncia() {
		return this.fechaDenuncia;
	}

	public void setFechaDenuncia(final Integer fechaDenuncia) {
		this.fechaDenuncia = fechaDenuncia;
	}

	public Integer getFechaSiniestro() {
		return this.fechaSiniestro;
	}

	public void setFechaSiniestro(final Integer fechaSiniestro) {
		this.fechaSiniestro = fechaSiniestro;
	}

	public Boolean getEsDenAseg() {
		return this.esDenAseg;
	}

	public void setEsDenAseg(final Boolean esDenAseg) {
		this.esDenAseg = esDenAseg;
	}

	public String getDenTipDoc() {
		return this.denTipDoc;
	}

	public void setDenTipDoc(final String denTipDoc) {
		this.denTipDoc = denTipDoc;
	}

	public String getDenNroDoc() {
		return this.denNroDoc;
	}

	public void setDenNroDoc(final String denNroDoc) {
		this.denNroDoc = denNroDoc;
	}

	public String getDenApeNom() {
		return this.denApeNom;
	}

	public void setDenApeNom(final String denApeNom) {
		this.denApeNom = denApeNom;
	}

	public Parentesco getDenParentesco() {
		return this.denParentesco;
	}

	public void setDenParentesco(final Parentesco denParentesco) {
		this.denParentesco = denParentesco;
	}

	public String getDescSiniestro() {
		return this.descSiniestro;
	}

	public void setDescSiniestro(final String descSiniestro) {
		this.descSiniestro = descSiniestro;
	}

	public String getDatosSiniestro() {
		return this.datosSiniestro;
	}

	public void setDatosSiniestro(final String datosSiniestro) {
		this.datosSiniestro = datosSiniestro;
	}

	public Boolean getAdjunto1() {
		return this.adjunto1;
	}

	public void setAdjunto1(final Boolean adjunto1) {
		this.adjunto1 = adjunto1;
	}

	public Boolean getAdjunto2() {
		return this.adjunto2;
	}

	public void setAdjunto2(final Boolean adjunto2) {
		this.adjunto2 = adjunto2;
	}

	public Boolean getAdjunto3() {
		return this.adjunto3;
	}

	public void setAdjunto3(final Boolean adjunto3) {
		this.adjunto3 = adjunto3;
	}

	public String getEstado() {
		return this.estado;
	}

	public void setEstado(final String estado) {
		this.estado = estado;
	}

	public String getPeopleSoft() {
		return this.peopleSoft;
	}

	public void setPeopleSoft(final String peopleSoft) {
		this.peopleSoft = peopleSoft;
	}

	public String getSiniestro() {
		return this.siniestro;
	}

	public void setSiniestro(final String siniestro) {
		this.siniestro = siniestro;
	}

	public String getUsuApeNom() {
		return this.usuApeNom;
	}

	public void setUsuApeNom(final String usuApeNom) {
		this.usuApeNom = usuApeNom;
	}
}
