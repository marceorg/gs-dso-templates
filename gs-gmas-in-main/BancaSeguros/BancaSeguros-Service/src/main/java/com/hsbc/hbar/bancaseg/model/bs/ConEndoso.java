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

import com.hsbc.hbar.bancaseg.model.common.Canal;
import com.hsbc.hbar.bancaseg.model.common.Endoso;
import com.hsbc.hbar.bancaseg.model.common.Producto;
import com.hsbc.hbar.bancaseg.model.common.Sucursal;

public class ConEndoso {
	private Producto producto;
	private Sucursal sucursal;
	private Canal canal;
	private String tomador;
	private String tipDoc;
	private String nroDoc;
	private Integer fechaEmision;
	private String estado;
	private String vendedorLegajo;
	private String vendedorNombre;
	private List<Endoso> endosoList;

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

	public List<Endoso> getEndosoList() {
		return this.endosoList;
	}

	public void setEndosoList(final List<Endoso> endosoList) {
		this.endosoList = endosoList;
	}

}
