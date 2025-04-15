/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.model.kyc;

import java.util.List;

import com.hsbc.hbar.kycseg.model.common.Actividad;
import com.hsbc.hbar.kycseg.model.common.AuthorizedUser;
import com.hsbc.hbar.kycseg.model.common.Caracter;
import com.hsbc.hbar.kycseg.model.common.Provincia;

public class KYCPersJur {
	// Generales
	private EstadoKYC estadoKYC;
	// Panel 1
	private Long numeroCUIT;
	private String razonSocial;
	private Integer fechaConstitucion;
	private String dirCalle;
	private String dirNumero;
	private String dirPiso;
	private String dirDepto;
	private Provincia dirProvincia;
	private String dirLocalidad;
	private String dirCodigoPostal;
	private String telefono;
	private String email;
	private List<Representante> representanteList;
	private Boolean esTitMPago;
	private List<TitularMedioPago> titMPagoList;
	// Panel 2
	private Actividad actividad;
	private String actividadDes;
	private String propositoDes;
	private Caracter caracter;
	private String caracterDes;
	private Boolean esClienteBco;
	private Boolean cotizaBolsa;
	private Boolean subsCiaCotizaBolsa;
	private Boolean cliRegOrganismo;
	private Boolean esSCC;
	private String motivoSCC;
	private Boolean tieneRepSCC;
	private String accionistas;
	private List<Compania> CompaniaList;
	private Boolean tieneRelHSBC;
	private String relDetalle;
	private Integer inicioAnn;
	private String balAuditor;
	private Integer balFecha;
	private Double balActivo;
	private Double balPasivo;
	private Double balPatNeto;
	private Double balVentas;
	private Double balResFinal;
	private Integer balFechaEstContable;
	private String docResDetalle;
	private String Observaciones;
	// Panel 3
	private Double valorOperar;
	private Double primaAnual;
	private String valorOperarMot;
	private String perfilComentarios;
	private Integer ultFecha;
	// Panel 4
	private List<OperacionInusual> opeInusualList;
	// Otros Datos
	private AuthorizedUser operador;
	private Integer opeFechaUpd;
	private AuthorizedUser supervisor;
	private Integer supFechaUpd;
	private String supComentario;
	private AuthorizedUser compliance;
	private Integer comFechaUpd;
	private String comComentario;
	// Datos en AIS
	private Boolean esSCCenAIS;
	private Double primaAnualenAIS;
	private Boolean perfilObligenAIS;
	private String tipoOperacion;
	private Integer vigenciaDesde;
	private Integer vigenciaHasta;

	public EstadoKYC getEstadoKYC() {
		return this.estadoKYC;
	}

	public void setEstadoKYC(final EstadoKYC estadoKYC) {
		this.estadoKYC = estadoKYC;
	}

	public Long getNumeroCUIT() {
		return this.numeroCUIT;
	}

	public void setNumeroCUIT(final Long numeroCUIT) {
		this.numeroCUIT = numeroCUIT;
	}

	public String getRazonSocial() {
		return this.razonSocial;
	}

	public void setRazonSocial(final String razonSocial) {
		this.razonSocial = razonSocial;
	}

	public Integer getFechaConstitucion() {
		return this.fechaConstitucion;
	}

	public void setFechaConstitucion(final Integer fechaConstitucion) {
		this.fechaConstitucion = fechaConstitucion;
	}

	public String getDirCalle() {
		return this.dirCalle;
	}

	public void setDirCalle(final String dirCalle) {
		this.dirCalle = dirCalle;
	}

	public String getDirNumero() {
		return this.dirNumero;
	}

	public void setDirNumero(final String dirNumero) {
		this.dirNumero = dirNumero;
	}

	public String getDirPiso() {
		return this.dirPiso;
	}

	public void setDirPiso(final String dirPiso) {
		this.dirPiso = dirPiso;
	}

	public String getDirDepto() {
		return this.dirDepto;
	}

	public void setDirDepto(final String dirDepto) {
		this.dirDepto = dirDepto;
	}

	public Provincia getDirProvincia() {
		return this.dirProvincia;
	}

	public void setDirProvincia(final Provincia dirProvincia) {
		this.dirProvincia = dirProvincia;
	}

	public String getDirLocalidad() {
		return this.dirLocalidad;
	}

	public void setDirLocalidad(final String dirLocalidad) {
		this.dirLocalidad = dirLocalidad;
	}

	public String getDirCodigoPostal() {
		return this.dirCodigoPostal;
	}

	public void setDirCodigoPostal(final String dirCodigoPostal) {
		this.dirCodigoPostal = dirCodigoPostal;
	}

	public String getTelefono() {
		return this.telefono;
	}

	public void setTelefono(final String telefono) {
		this.telefono = telefono;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(final String email) {
		this.email = email;
	}

	public List<Representante> getRepresentanteList() {
		return this.representanteList;
	}

	public void setRepresentanteList(final List<Representante> representanteList) {
		this.representanteList = representanteList;
	}

	public Boolean getEsTitMPago() {
		return this.esTitMPago;
	}

	public void setEsTitMPago(final Boolean esTitMPago) {
		this.esTitMPago = esTitMPago;
	}

	public List<TitularMedioPago> getTitMPagoList() {
		return this.titMPagoList;
	}

	public void setTitMPagoList(final List<TitularMedioPago> titMPagoList) {
		this.titMPagoList = titMPagoList;
	}

	public Actividad getActividad() {
		return this.actividad;
	}

	public void setActividad(final Actividad actividad) {
		this.actividad = actividad;
	}

	public String getActividadDes() {
		return this.actividadDes;
	}

	public void setActividadDes(final String actividadDes) {
		this.actividadDes = actividadDes;
	}

	public String getPropositoDes() {
		return this.propositoDes;
	}

	public void setPropositoDes(final String propositoDes) {
		this.propositoDes = propositoDes;
	}

	public Caracter getCaracter() {
		return this.caracter;
	}

	public void setCaracter(final Caracter caracter) {
		this.caracter = caracter;
	}

	public String getCaracterDes() {
		return this.caracterDes;
	}

	public void setCaracterDes(final String caracterDes) {
		this.caracterDes = caracterDes;
	}

	public Boolean getEsClienteBco() {
		return this.esClienteBco;
	}

	public void setEsClienteBco(final Boolean esClienteBco) {
		this.esClienteBco = esClienteBco;
	}

	public Boolean getCotizaBolsa() {
		return this.cotizaBolsa;
	}

	public void setCotizaBolsa(final Boolean cotizaBolsa) {
		this.cotizaBolsa = cotizaBolsa;
	}

	public Boolean getSubsCiaCotizaBolsa() {
		return this.subsCiaCotizaBolsa;
	}

	public void setSubsCiaCotizaBolsa(final Boolean subsCiaCotizaBolsa) {
		this.subsCiaCotizaBolsa = subsCiaCotizaBolsa;
	}

	public Boolean getCliRegOrganismo() {
		return this.cliRegOrganismo;
	}

	public void setCliRegOrganismo(final Boolean cliRegOrganismo) {
		this.cliRegOrganismo = cliRegOrganismo;
	}

	public Boolean getEsSCC() {
		return this.esSCC;
	}

	public void setEsSCC(final Boolean esSCC) {
		this.esSCC = esSCC;
	}

	public String getMotivoSCC() {
		return this.motivoSCC;
	}

	public void setMotivoSCC(final String motivoSCC) {
		this.motivoSCC = motivoSCC;
	}

	public Boolean getTieneRepSCC() {
		return this.tieneRepSCC;
	}

	public void setTieneRepSCC(final Boolean tieneRepSCC) {
		this.tieneRepSCC = tieneRepSCC;
	}

	public String getAccionistas() {
		return this.accionistas;
	}

	public void setAccionistas(final String accionistas) {
		this.accionistas = accionistas;
	}

	public List<Compania> getCompaniaList() {
		return this.CompaniaList;
	}

	public void setCompaniaList(final List<Compania> companiaList) {
		this.CompaniaList = companiaList;
	}

	public Boolean getTieneRelHSBC() {
		return this.tieneRelHSBC;
	}

	public void setTieneRelHSBC(final Boolean tieneRelHSBC) {
		this.tieneRelHSBC = tieneRelHSBC;
	}

	public String getRelDetalle() {
		return this.relDetalle;
	}

	public void setRelDetalle(final String relDetalle) {
		this.relDetalle = relDetalle;
	}

	public Integer getInicioAnn() {
		return this.inicioAnn;
	}

	public void setInicioAnn(final Integer inicioAnn) {
		this.inicioAnn = inicioAnn;
	}

	public String getBalAuditor() {
		return this.balAuditor;
	}

	public void setBalAuditor(final String balAuditor) {
		this.balAuditor = balAuditor;
	}

	public Integer getBalFecha() {
		return this.balFecha;
	}

	public void setBalFecha(final Integer balFecha) {
		this.balFecha = balFecha;
	}

	public Double getBalActivo() {
		return this.balActivo;
	}

	public void setBalActivo(final Double balActivo) {
		this.balActivo = balActivo;
	}

	public Double getBalPasivo() {
		return this.balPasivo;
	}

	public void setBalPasivo(final Double balPasivo) {
		this.balPasivo = balPasivo;
	}

	public Double getBalPatNeto() {
		return this.balPatNeto;
	}

	public void setBalPatNeto(final Double balPatNeto) {
		this.balPatNeto = balPatNeto;
	}

	public Double getBalVentas() {
		return this.balVentas;
	}

	public void setBalVentas(final Double balVentas) {
		this.balVentas = balVentas;
	}

	public Double getBalResFinal() {
		return this.balResFinal;
	}

	public void setBalResFinal(final Double balResFinal) {
		this.balResFinal = balResFinal;
	}

	public Integer getBalFechaEstContable() {
		return this.balFechaEstContable;
	}

	public void setBalFechaEstContable(final Integer balFechaEstContable) {
		this.balFechaEstContable = balFechaEstContable;
	}

	public String getDocResDetalle() {
		return this.docResDetalle;
	}

	public void setDocResDetalle(final String docResDetalle) {
		this.docResDetalle = docResDetalle;
	}

	public String getObservaciones() {
		return this.Observaciones;
	}

	public void setObservaciones(final String observaciones) {
		this.Observaciones = observaciones;
	}

	public Double getValorOperar() {
		return this.valorOperar;
	}

	public void setValorOperar(final Double valorOperar) {
		this.valorOperar = valorOperar;
	}

	public Double getPrimaAnual() {
		return this.primaAnual;
	}

	public void setPrimaAnual(final Double primaAnual) {
		this.primaAnual = primaAnual;
	}

	public String getValorOperarMot() {
		return this.valorOperarMot;
	}

	public void setValorOperarMot(final String valorOperarMot) {
		this.valorOperarMot = valorOperarMot;
	}

	public String getPerfilComentarios() {
		return this.perfilComentarios;
	}

	public void setPerfilComentarios(final String perfilComentarios) {
		this.perfilComentarios = perfilComentarios;
	}

	public Integer getUltFecha() {
		return this.ultFecha;
	}

	public void setUltFecha(final Integer ultFecha) {
		this.ultFecha = ultFecha;
	}

	public List<OperacionInusual> getOpeInusualList() {
		return this.opeInusualList;
	}

	public void setOpeInusualList(final List<OperacionInusual> opeInusualList) {
		this.opeInusualList = opeInusualList;
	}

	public AuthorizedUser getOperador() {
		return this.operador;
	}

	public void setOperador(final AuthorizedUser operador) {
		this.operador = operador;
	}

	public Integer getOpeFechaUpd() {
		return this.opeFechaUpd;
	}

	public void setOpeFechaUpd(final Integer opeFechaUpd) {
		this.opeFechaUpd = opeFechaUpd;
	}

	public AuthorizedUser getSupervisor() {
		return this.supervisor;
	}

	public void setSupervisor(final AuthorizedUser supervisor) {
		this.supervisor = supervisor;
	}

	public Integer getSupFechaUpd() {
		return this.supFechaUpd;
	}

	public void setSupFechaUpd(final Integer supFechaUpd) {
		this.supFechaUpd = supFechaUpd;
	}

	public AuthorizedUser getCompliance() {
		return this.compliance;
	}

	public void setCompliance(final AuthorizedUser compliance) {
		this.compliance = compliance;
	}

	public Integer getComFechaUpd() {
		return this.comFechaUpd;
	}

	public void setComFechaUpd(final Integer comFechaUpd) {
		this.comFechaUpd = comFechaUpd;
	}

	public Boolean getEsSCCenAIS() {
		return this.esSCCenAIS;
	}

	public void setEsSCCenAIS(final Boolean esSCCenAIS) {
		this.esSCCenAIS = esSCCenAIS;
	}

	public Double getPrimaAnualenAIS() {
		return this.primaAnualenAIS;
	}

	public void setPrimaAnualenAIS(final Double primaAnualenAIS) {
		this.primaAnualenAIS = primaAnualenAIS;
	}

	public Boolean getPerfilObligenAIS() {
		return this.perfilObligenAIS;
	}

	public void setPerfilObligenAIS(final Boolean perfilObligenAIS) {
		this.perfilObligenAIS = perfilObligenAIS;
	}

	public String getTipoOperacion() {
		return this.tipoOperacion;
	}

	public void setTipoOperacion(final String tipoOperacion) {
		this.tipoOperacion = tipoOperacion;
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

	public String getSupComentario() {
		return this.supComentario;
	}

	public void setSupComentario(final String supComentario) {
		this.supComentario = supComentario;
	}

	public String getComComentario() {
		return this.comComentario;
	}

	public void setComComentario(final String comComentario) {
		this.comComentario = comComentario;
	}
}
