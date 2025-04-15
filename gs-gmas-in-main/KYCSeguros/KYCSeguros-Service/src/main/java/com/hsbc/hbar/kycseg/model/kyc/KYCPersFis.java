/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
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
import com.hsbc.hbar.kycseg.model.common.CondicionIVA;
import com.hsbc.hbar.kycseg.model.common.Pais;
import com.hsbc.hbar.kycseg.model.common.Provincia;
import com.hsbc.hbar.kycseg.model.common.TipoDoc;

public class KYCPersFis {
	// Generales
	private EstadoKYC estadoKYC;
	// Panel 1
	private TipoDoc tipoDoc;
	private Long numeroDoc;
	private Long numeroCUIL;
	private String apellido;
	private String nombre;
	private Pais nacionalidad;
	private Integer fechaNacimiento;
	private String dirCalle;
	private String dirNumero;
	private String dirPiso;
	private String dirDepto;
	private Provincia dirProvincia;
	private String dirLocalidad;
	private String dirCodigoPostal;
	private String telefono;
	private String email;
	private Boolean tieneRep;
	private List<Representante> representanteList;
	private Boolean esTitMPago;
	private List<TitularMedioPago> titMPagoList;
	// Panel 2
	private Actividad actividad;
	private String actividadDes;
	private String propositoDes;
	private Boolean esSCC;
	private String motivoSCC;
	private Boolean esPEP;
	private Boolean tieneRepSCC;
	private Boolean esClienteBco;
	private CondicionIVA condicionIVA;
	private String condicionLab;
	private String categoriaMono;
	private Integer ingFecha;
	private Double ingSalMen;
	private Double ingSalario;
	private Double ingGanancia;
	private Double ingOtros;
	private Double ingTotal;
	private String docResDetalle;
	private Boolean tieneRelHSBC;
	private String relDetalle;
	private Integer inicioAnn;
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
	private Boolean esPEPenAIS;
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

	public TipoDoc getTipoDoc() {
		return this.tipoDoc;
	}

	public void setTipoDoc(final TipoDoc tipoDoc) {
		this.tipoDoc = tipoDoc;
	}

	public Long getNumeroDoc() {
		return this.numeroDoc;
	}

	public void setNumeroDoc(final Long numeroDoc) {
		this.numeroDoc = numeroDoc;
	}

	public Long getNumeroCUIL() {
		return this.numeroCUIL;
	}

	public void setNumeroCUIL(final Long numeroCUIL) {
		this.numeroCUIL = numeroCUIL;
	}

	public String getApellido() {
		return this.apellido;
	}

	public void setApellido(final String apellido) {
		this.apellido = apellido;
	}

	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(final String nombre) {
		this.nombre = nombre;
	}

	public Pais getNacionalidad() {
		return this.nacionalidad;
	}

	public void setNacionalidad(final Pais nacionalidad) {
		this.nacionalidad = nacionalidad;
	}

	public Integer getFechaNacimiento() {
		return this.fechaNacimiento;
	}

	public void setFechaNacimiento(final Integer fechaNacimiento) {
		this.fechaNacimiento = fechaNacimiento;
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

	public Boolean getTieneRep() {
		return this.tieneRep;
	}

	public void setTieneRep(final Boolean tieneRep) {
		this.tieneRep = tieneRep;
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

	public Boolean getEsPEP() {
		return this.esPEP;
	}

	public void setEsPEP(final Boolean esPEP) {
		this.esPEP = esPEP;
	}

	public Boolean getTieneRepSCC() {
		return this.tieneRepSCC;
	}

	public void setTieneRepSCC(final Boolean tieneRepSCC) {
		this.tieneRepSCC = tieneRepSCC;
	}

	public Boolean getEsClienteBco() {
		return this.esClienteBco;
	}

	public void setEsClienteBco(final Boolean esClienteBco) {
		this.esClienteBco = esClienteBco;
	}

	public CondicionIVA getCondicionIVA() {
		return this.condicionIVA;
	}

	public void setCondicionIVA(final CondicionIVA condicionIVA) {
		this.condicionIVA = condicionIVA;
	}

	public String getCondicionLab() {
		return this.condicionLab;
	}

	public void setCondicionLab(final String condicionLab) {
		this.condicionLab = condicionLab;
	}

	public String getCategoriaMono() {
		return this.categoriaMono;
	}

	public void setCategoriaMono(final String categoriaMono) {
		this.categoriaMono = categoriaMono;
	}

	public Integer getIngFecha() {
		return this.ingFecha;
	}

	public void setIngFecha(final Integer ingFecha) {
		this.ingFecha = ingFecha;
	}

	public Double getIngSalMen() {
		return this.ingSalMen;
	}

	public void setIngSalMen(final Double ingSalMen) {
		this.ingSalMen = ingSalMen;
	}

	public Double getIngSalario() {
		return this.ingSalario;
	}

	public void setIngSalario(final Double ingSalario) {
		this.ingSalario = ingSalario;
	}

	public Double getIngGanancia() {
		return this.ingGanancia;
	}

	public void setIngGanancia(final Double ingGanancia) {
		this.ingGanancia = ingGanancia;
	}

	public Double getIngOtros() {
		return this.ingOtros;
	}

	public void setIngOtros(final Double ingOtros) {
		this.ingOtros = ingOtros;
	}

	public Double getIngTotal() {
		return this.ingTotal;
	}

	public void setIngTotal(final Double ingTotal) {
		this.ingTotal = ingTotal;
	}

	public String getDocResDetalle() {
		return this.docResDetalle;
	}

	public void setDocResDetalle(final String docResDetalle) {
		this.docResDetalle = docResDetalle;
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

	public Boolean getEsPEPenAIS() {
		return this.esPEPenAIS;
	}

	public void setEsPEPenAIS(final Boolean esPEPenAIS) {
		this.esPEPenAIS = esPEPenAIS;
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
