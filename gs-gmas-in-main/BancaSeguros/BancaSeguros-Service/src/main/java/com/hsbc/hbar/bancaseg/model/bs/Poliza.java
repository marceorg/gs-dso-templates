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

import com.hsbc.hbar.bancaseg.model.common.AsegAdic;
import com.hsbc.hbar.bancaseg.model.common.Asegurado;
import com.hsbc.hbar.bancaseg.model.common.Beneficiario;
import com.hsbc.hbar.bancaseg.model.common.Canal;
import com.hsbc.hbar.bancaseg.model.common.Cobertura;
import com.hsbc.hbar.bancaseg.model.common.Producto;
import com.hsbc.hbar.bancaseg.model.common.Riesgo;
import com.hsbc.hbar.bancaseg.model.common.Sucursal;

public class Poliza {
	private Producto producto;
	private Sucursal sucursal;
	private Canal canal;
	private String tomador;
	private String tipDoc;
	private Integer tipDocCod;
	private String nroDoc;
	private Integer fechaEmision;
	private String estado;
	private String vendedorLegajo;
	private String vendedorNombre;
	private Double premio;
	private Integer vigenciaDesde;
	private Integer vigenciaHasta;
	private Integer fechaRegistracion;
	private Long orden;
	private String canalCobro;
	private String tipCta;
	private String nroCta;
	private String campana;
	private Asegurado asegurado;
	private List<AsegAdic> asegAdicList;
	private String leyeBeneficiario;
	private List<Beneficiario> beneficiarioList;
	private List<Cobertura> coberturaList;
	private List<Riesgo> riesgoList;

	public Producto getProducto() {
		return this.producto;
	}

	public void setProducto(final Producto producto) {
		this.producto = producto;
	}

	public Sucursal getSucursal() {
		return this.sucursal;
	}

	public void setSucursal(final Sucursal sucursal) {
		this.sucursal = sucursal;
	}

	public Canal getCanal() {
		return this.canal;
	}

	public void setCanal(final Canal canal) {
		this.canal = canal;
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

	public Integer getTipDocCod() {
		return tipDocCod;
	}

	public void setTipDocCod(Integer tipDocCod) {
		this.tipDocCod = tipDocCod;
	}

	public String getNroDoc() {
		return this.nroDoc;
	}

	public void setNroDoc(final String nroDoc) {
		this.nroDoc = nroDoc;
	}

	public Integer getFechaEmision() {
		return this.fechaEmision;
	}

	public void setFechaEmision(final Integer fechaEmision) {
		this.fechaEmision = fechaEmision;
	}

	public String getEstado() {
		return this.estado;
	}

	public void setEstado(final String estado) {
		this.estado = estado;
	}

	public String getVendedorLegajo() {
		return this.vendedorLegajo;
	}

	public void setVendedorLegajo(final String vendedorLegajo) {
		this.vendedorLegajo = vendedorLegajo;
	}

	public String getVendedorNombre() {
		return this.vendedorNombre;
	}

	public void setVendedorNombre(final String vendedorNombre) {
		this.vendedorNombre = vendedorNombre;
	}

	public Double getPremio() {
		return this.premio;
	}

	public void setPremio(final Double premio) {
		this.premio = premio;
	}

	public Integer getVigenciaDesde() {
		return this.vigenciaDesde;
	}

	public void setVigenciaDesde(final Integer vigenciaDesde) {
		this.vigenciaDesde = vigenciaDesde;
	}

	public Integer getVigenciaHasta() {
		return this.vigenciaHasta;
	}

	public void setVigenciaHasta(final Integer vigenciaHasta) {
		this.vigenciaHasta = vigenciaHasta;
	}

	public Integer getFechaRegistracion() {
		return this.fechaRegistracion;
	}

	public void setFechaRegistracion(final Integer fechaRegistracion) {
		this.fechaRegistracion = fechaRegistracion;
	}

	public Long getOrden() {
		return this.orden;
	}

	public void setOrden(final Long orden) {
		this.orden = orden;
	}

	public String getCanalCobro() {
		return this.canalCobro;
	}

	public void setCanalCobro(final String canalCobro) {
		this.canalCobro = canalCobro;
	}

	public String getTipCta() {
		return this.tipCta;
	}

	public void setTipCta(final String tipCta) {
		this.tipCta = tipCta;
	}

	public String getNroCta() {
		return this.nroCta;
	}

	public void setNroCta(final String nroCta) {
		this.nroCta = nroCta;
	}

	public String getCampana() {
		return this.campana;
	}

	public void setCampana(final String campana) {
		this.campana = campana;
	}

	public Asegurado getAsegurado() {
		return this.asegurado;
	}

	public void setAsegurado(final Asegurado asegurado) {
		this.asegurado = asegurado;
	}

	public List<AsegAdic> getAsegAdicList() {
		return this.asegAdicList;
	}

	public void setAsegAdicList(final List<AsegAdic> asegAdicList) {
		this.asegAdicList = asegAdicList;
	}

	public List<Beneficiario> getBeneficiarioList() {
		return this.beneficiarioList;
	}

	public void setBeneficiarioList(final List<Beneficiario> beneficiarioList) {
		this.beneficiarioList = beneficiarioList;
	}

	public List<Cobertura> getCoberturaList() {
		return this.coberturaList;
	}

	public void setCoberturaList(final List<Cobertura> coberturaList) {
		this.coberturaList = coberturaList;
	}

	public List<Riesgo> getRiesgoList() {
		return this.riesgoList;
	}

	public void setRiesgoList(final List<Riesgo> riesgoList) {
		this.riesgoList = riesgoList;
	}

	public String getLeyeBeneficiario() {
		return this.leyeBeneficiario;
	}

	public void setLeyeBeneficiario(final String leyeBeneficiario) {
		this.leyeBeneficiario = leyeBeneficiario;
	}

}
