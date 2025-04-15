/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2013. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.hsbc.hbar.kycseg.dao.KYCDao;
import com.hsbc.hbar.kycseg.model.common.Actividad;
import com.hsbc.hbar.kycseg.model.common.AuthorizedUser;
import com.hsbc.hbar.kycseg.model.common.Caracter;
import com.hsbc.hbar.kycseg.model.common.CondicionIVA;
import com.hsbc.hbar.kycseg.model.common.Pais;
import com.hsbc.hbar.kycseg.model.common.Provincia;
import com.hsbc.hbar.kycseg.model.common.TipoDoc;
import com.hsbc.hbar.kycseg.model.constant.KYCSegConstants;
import com.hsbc.hbar.kycseg.model.kyc.Compania;
import com.hsbc.hbar.kycseg.model.kyc.EstadoKYC;
import com.hsbc.hbar.kycseg.model.kyc.KYCPendiente;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersFis;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersJur;
import com.hsbc.hbar.kycseg.model.kyc.KYCSetResp;
import com.hsbc.hbar.kycseg.model.kyc.OperacionInusual;
import com.hsbc.hbar.kycseg.model.kyc.Representante;
import com.hsbc.hbar.kycseg.model.kyc.TitularMedioPago;
import com.hsbc.hbar.kycseg.service.JMSCommService;
import com.hsbc.hbar.kycseg.service.KYCService;
import com.hsbc.hbar.kycseg.service.UtilCommService;
import com.hsbc.hbar.kycseg.service.utils.UtilFormat;

public class KYCServiceImpl implements KYCService {
	static Logger logger = LogManager.getLogger(KYCServiceImpl.class);

	private KYCDao kycDao;
	private UtilCommService utilCommService;
	private JMSCommService jmsCommService;

	public KYCDao getKYCDao() {
		if (this.kycDao == null) {
			this.kycDao = (KYCDao) ServiceFactory.getContext().getBean("KYCDao");
		}
		return this.kycDao;
	}

	public void setKYCDao(final KYCDao kycDao) {
		this.kycDao = kycDao;
	}

	public UtilCommService getUtilCommService() {
		if (this.utilCommService == null) {
			this.utilCommService = (UtilCommService) ServiceFactory.getContext().getBean("UtilCommService");
		}
		return this.utilCommService;
	}

	public void setUtilCommService(final UtilCommService utilCommService) {
		this.utilCommService = utilCommService;
	}

	public JMSCommService getJMSCommService() {
		if (this.jmsCommService == null) {
			this.jmsCommService = (JMSCommService) ServiceFactory.getContext().getBean("JMSCommService");
		}
		return this.jmsCommService;
	}

	public void setJMSCommService(final JMSCommService jmsCommService) {
		this.jmsCommService = jmsCommService;
	}

	public List<KYCPersFis> getKYCPersFis(final HttpServletRequest httpServletRequest, final Integer cache,
			final Long numeroCUIL, final String apellido, final String nombre) {
		// Obtengo el usuario
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		// Datos del AIS
		List<KYCPersFis> kycPersFisListAIS = new ArrayList<KYCPersFis>();
		try {
			// Primera llamada
			kycPersFisListAIS.add(this.getJMSCommService().getKYCPersFis(1, numeroCUIL, UtilFormat.getValChars(apellido),
					UtilFormat.getValChars(nombre)));

			if (kycPersFisListAIS.get(0) != null) {
				if (kycPersFisListAIS.get(0).getEstadoKYC().getCodigo().equalsIgnoreCase("P")) {
					// No corresponde el tipo de persona
					// Agrego uno con estado X
					KYCPersFis kycPersFis = new KYCPersFis();
					EstadoKYC estadoKYC = new EstadoKYC();
					estadoKYC.setCodigo("X");
					kycPersFis.setEstadoKYC(estadoKYC);
					kycPersFisListAIS.add(kycPersFis);
				} else if (kycPersFisListAIS.get(0).getEstadoKYC().getCodigo().equalsIgnoreCase("N")) {
					// Es un alta (trae datos precargados)
					// Agrego uno antes con estado X
					KYCPersFis kycPersFis = new KYCPersFis();
					EstadoKYC estadoKYC = new EstadoKYC();
					estadoKYC.setCodigo("X");
					kycPersFis.setEstadoKYC(estadoKYC);
					kycPersFisListAIS.add(0, kycPersFis);
				} else if (kycPersFisListAIS.get(0).getEstadoKYC().getCodigo().equalsIgnoreCase("X")) {
					// Es un alta (no trae datos precargados)
					// Agrego uno antes con estado X
					KYCPersFis kycPersFis = new KYCPersFis();
					EstadoKYC estadoKYC = new EstadoKYC();
					estadoKYC.setCodigo("X");
					kycPersFis.setEstadoKYC(estadoKYC);
					kycPersFisListAIS.add(0, kycPersFis);
				} else if (kycPersFisListAIS.get(0).getEstadoKYC().getCodigo().equalsIgnoreCase("")) {
					// No es un alta (no tiene kyc aprobados)
					// Cambio el estado a X y llamo al segundo
					kycPersFisListAIS.get(0).getEstadoKYC().setCodigo("X");
					// Segunda llamada
					kycPersFisListAIS.add(this.getJMSCommService().getKYCPersFis(2, numeroCUIL,
							UtilFormat.getValChars(apellido), UtilFormat.getValChars(nombre)));
				} else {
					// No es un alta (tiene kyc aprobados)
					// Dejo como esta y llamo al segundo
					// Segunda llamada
					kycPersFisListAIS.add(this.getJMSCommService().getKYCPersFis(2, numeroCUIL,
							UtilFormat.getValChars(apellido), UtilFormat.getValChars(nombre)));
					// Si no tiene uno en proceso lo pongo en estado N
					if (kycPersFisListAIS.get(1).getEstadoKYC().getCodigo().equalsIgnoreCase("")) {
						kycPersFisListAIS.get(1).getEstadoKYC().setCodigo("N");
					}
				}
			} else {
				return kycPersFisListAIS;
			}
		} catch (Exception e) {
			KYCServiceImpl.logger.error(e);
		}

		// Datos recuperados (Solo perfil OPERADOR)
		if (au.getProfileKey().equalsIgnoreCase(KYCSegConstants.KYCS_USRPROF_OPE)) {
			// Si la segunda es N la reemplazo por la recuperada
			if (kycPersFisListAIS.get(1).getEstadoKYC().getCodigo().equalsIgnoreCase("N")) {
				// Recupero de la BD
				List<KYCPersFis> kycPersFisListREC = this.getKYCDao().getKYCPersFis(numeroCUIL);
				// Si recupero
				if (kycPersFisListREC.size() > 0) {
					// Determinar cual reemplazar
					Integer indexRec = 0;
					if (kycPersFisListAIS.get(0).getEstadoKYC().getCodigo().equalsIgnoreCase("X")) {
						indexRec = 2;
					} else {
						indexRec = 0;
					}

					// Agregar la recuperada
					kycPersFisListAIS.add(indexRec, kycPersFisListREC.get(0));
					// Copiar algunos datos de la original
					kycPersFisListAIS.get(indexRec).setEstadoKYC(kycPersFisListAIS.get(1).getEstadoKYC());
					kycPersFisListAIS
							.get(indexRec)
							.getEstadoKYC()
							.setDescripcion(
									kycPersFisListAIS.get(indexRec).getEstadoKYC().getDescripcion() + " (RECUPERADO)");
					kycPersFisListAIS.get(indexRec).setTipoOperacion(kycPersFisListAIS.get(1).getTipoOperacion());
					kycPersFisListAIS.get(indexRec).setVigenciaDesde(kycPersFisListAIS.get(1).getVigenciaDesde());
					kycPersFisListAIS.get(indexRec).setVigenciaHasta(kycPersFisListAIS.get(1).getVigenciaHasta());
					kycPersFisListAIS.get(indexRec).setOperador(kycPersFisListAIS.get(1).getOperador());
					kycPersFisListAIS.get(indexRec).setOpeFechaUpd(kycPersFisListAIS.get(1).getOpeFechaUpd());
					kycPersFisListAIS.get(indexRec).setSupervisor(kycPersFisListAIS.get(1).getSupervisor());
					kycPersFisListAIS.get(indexRec).setSupFechaUpd(kycPersFisListAIS.get(1).getSupFechaUpd());
					kycPersFisListAIS.get(indexRec).setCompliance(kycPersFisListAIS.get(1).getCompliance());
					kycPersFisListAIS.get(indexRec).setComFechaUpd(kycPersFisListAIS.get(1).getComFechaUpd());
					kycPersFisListAIS.get(indexRec).setEsPEPenAIS(kycPersFisListAIS.get(1).getEsPEPenAIS());
					kycPersFisListAIS.get(indexRec).setEsSCCenAIS(kycPersFisListAIS.get(1).getEsSCCenAIS());
					kycPersFisListAIS.get(indexRec).setPrimaAnualenAIS(kycPersFisListAIS.get(1).getPrimaAnualenAIS());
					kycPersFisListAIS.get(indexRec).setPerfilObligenAIS(kycPersFisListAIS.get(1).getPerfilObligenAIS());
					// Borrar la original
					kycPersFisListAIS.remove(1);
				}
			}
		}

		return kycPersFisListAIS;
	}

	// fechaNacimiento_PPCR_2015-00142_(ENS)
	public Boolean setKYCPersFis(final Integer cache, final Integer tipoDocNum, final String tipoDocDes,
			final Long numeroDoc, final Long numeroCUIL, final String apellido, final String nombre,
			final Integer nacionalidadCod, final Integer fechaNacimiento, final String dirCalle, final String dirNumero,
			final String dirPiso, final String dirDepto, final Integer dirProvincia, final String dirLocalidad,
			final String dirCodigoPostal, final String telefono, final String email, final Boolean tieneRep,
			final String representanteList, final Boolean esTitMPago, final String titMPagoList, final Integer actividadCod,
			final String actividadNom, final String actividadDes, final String propositoDes, final Boolean esSCC,
			final String motivoSCC, final Boolean esPEP, final Boolean tieneRepSCC, final Boolean esClienteBco,
			final Integer condicionIVA, final String condicionLab, final String categoriaMono, final Integer ingFecha,
			final Double ingSalMen, final Double ingSalario, final Double ingGanancia, final Double ingOtros,
			final Double ingTotal, final String docResDetalle, final Boolean tieneRelHSBC, final String relDetalle,
			final Integer inicioAnn, final Double valorOperar, final Double primaAnual, final String valorOperarMot,
			final String perfilComentarios, final Integer ultFecha, final String opeInusualList, final String opePeopleSoft,
			final String opeApellido, final String opeNombre) {
		// KYC PF
		KYCPersFis kycPersFis = new KYCPersFis();
		TipoDoc tipoDoc = new TipoDoc();
		tipoDoc.setId(tipoDocNum);
		tipoDoc.setName(tipoDocDes);
		kycPersFis.setTipoDoc(tipoDoc);
		kycPersFis.setNumeroDoc(numeroDoc);
		kycPersFis.setNumeroCUIL(numeroCUIL);
		kycPersFis.setApellido(UtilFormat.getValChars(apellido));
		kycPersFis.setNombre(UtilFormat.getValChars(nombre));
		Pais nacionalidad = new Pais();
		nacionalidad.setId(nacionalidadCod);
		kycPersFis.setNacionalidad(nacionalidad);
		kycPersFis.setFechaNacimiento(fechaNacimiento);
		kycPersFis.setDirCalle(UtilFormat.getValChars(dirCalle));
		kycPersFis.setDirNumero(dirNumero);
		kycPersFis.setDirPiso(dirPiso);
		kycPersFis.setDirDepto(dirDepto);
		Provincia provincia = new Provincia();
		provincia.setId(dirProvincia);
		kycPersFis.setDirProvincia(provincia);
		kycPersFis.setDirLocalidad(UtilFormat.getValChars(dirLocalidad));
		kycPersFis.setDirCodigoPostal(dirCodigoPostal);
		kycPersFis.setTelefono(telefono);
		kycPersFis.setEmail(email);
		kycPersFis.setTieneRep(tieneRep);
		kycPersFis.setRepresentanteList(parseRepresentante(representanteList));
		kycPersFis.setEsTitMPago(esTitMPago);
		kycPersFis.setTitMPagoList(parseTitMPagoList(titMPagoList));
		Actividad actividad = new Actividad();
		actividad.setId(actividadCod);
		actividad.setName(UtilFormat.getValChars(actividadNom));
		kycPersFis.setActividad(actividad);
		kycPersFis.setActividadDes(UtilFormat.getValChars(actividadDes));
		kycPersFis.setPropositoDes(UtilFormat.getValChars(propositoDes));
		kycPersFis.setEsSCC(esSCC);
		kycPersFis.setMotivoSCC(UtilFormat.getValChars(motivoSCC));
		kycPersFis.setEsPEP(esPEP);
		kycPersFis.setTieneRepSCC(tieneRepSCC);
		kycPersFis.setEsClienteBco(esClienteBco);
		CondicionIVA condIVA = new CondicionIVA();
		condIVA.setId(condicionIVA);
		kycPersFis.setCondicionIVA(condIVA);
		kycPersFis.setCondicionLab(condicionLab);
		kycPersFis.setCategoriaMono(categoriaMono);
		kycPersFis.setIngFecha(ingFecha);
		kycPersFis.setIngSalMen(ingSalMen);
		kycPersFis.setIngSalario(ingSalario);
		kycPersFis.setIngGanancia(ingGanancia);
		kycPersFis.setIngOtros(ingOtros);
		kycPersFis.setIngTotal(ingTotal);
		kycPersFis.setDocResDetalle(UtilFormat.getValChars(docResDetalle));
		kycPersFis.setTieneRelHSBC(tieneRelHSBC);
		kycPersFis.setRelDetalle(UtilFormat.getValChars(relDetalle));
		kycPersFis.setInicioAnn(inicioAnn);
		kycPersFis.setValorOperar(valorOperar);
		kycPersFis.setPrimaAnual(primaAnual);
		kycPersFis.setValorOperarMot(UtilFormat.getValChars(valorOperarMot));
		kycPersFis.setPerfilComentarios(UtilFormat.getValChars(perfilComentarios));
		kycPersFis.setUltFecha(ultFecha);
		kycPersFis.setOpeInusualList(parseOpeInusualList(opeInusualList));
		// Operador
		AuthorizedUser operador = new AuthorizedUser();
		operador.setPeopleSoft(opePeopleSoft);
		operador.setlName(UtilFormat.getValChars(opeApellido));
		operador.setfName(UtilFormat.getValChars(opeNombre));
		operador.setProfileKey(KYCSegConstants.KYCS_USRPROF_OPE);

		return this.getKYCDao().setKYCPersFis(kycPersFis, operador);
	}

	public KYCSetResp setKYCPersFisAIS(final HttpServletRequest httpServletRequest, final Integer cache,
			final Long numeroCUIL, final String tipoOperacion, final Boolean actPerfilTrans, final Boolean esKYCNuevo,
			final Integer vigenciaDesde, final Integer vigenciaHasta, final Boolean perfilObligenAIS,
			final String supPeopleSoft, final String supApellido, final String supNombre) {
		KYCSetResp kycSetResp = null;

		// Recupero el recien grabado
		List<KYCPersFis> kycPersFisList = this.getKYCDao().getKYCPersFis(numeroCUIL);
		// Obtengo los usuarios
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser operador = (AuthorizedUser) session.getAttribute("authorizedUser");
		AuthorizedUser supervisor = new AuthorizedUser();
		supervisor.setPeopleSoft(supPeopleSoft);
		supervisor.setlName(UtilFormat.getValChars(supApellido));
		supervisor.setfName(UtilFormat.getValChars(supNombre));
		supervisor.setProfileKey(KYCSegConstants.KYCS_USRPROF_SUP);
		// Llamo al mensaje
		kycSetResp = this.getJMSCommService().setKYCPersFis(kycPersFisList.get(0), tipoOperacion, actPerfilTrans,
				esKYCNuevo, vigenciaDesde, vigenciaHasta, perfilObligenAIS, operador, supervisor);
		// Si esta OK borro el temporal
		if (kycSetResp != null) {
			if (kycSetResp.getEstadoGra() == 0) {
				this.getKYCDao().delKYCPersFis(numeroCUIL);
			}
		}

		return kycSetResp;
	}

	public List<KYCPersJur> getKYCPersJur(final HttpServletRequest httpServletRequest, final Integer cache,
			final Long numeroCUIT, final String razonSocial) {
		// Obtengo el usuario
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		// Datos del AIS
		List<KYCPersJur> kycPersJurListAIS = new ArrayList<KYCPersJur>();
		try {
			// Primera llamada
			kycPersJurListAIS
					.add(this.getJMSCommService().getKYCPersJur(1, numeroCUIT, UtilFormat.getValChars(razonSocial)));

			if (kycPersJurListAIS.get(0) != null) {
				if (kycPersJurListAIS.get(0).getEstadoKYC().getCodigo().equalsIgnoreCase("P")) {
					// No corresponde el tipo de persona
					// Agrego uno con estado X
					KYCPersJur kycPersJur = new KYCPersJur();
					EstadoKYC estadoKYC = new EstadoKYC();
					estadoKYC.setCodigo("X");
					kycPersJur.setEstadoKYC(estadoKYC);
					kycPersJurListAIS.add(kycPersJur);
				} else if (kycPersJurListAIS.get(0).getEstadoKYC().getCodigo().equalsIgnoreCase("N")) {
					// Es un alta (trae datos precargados)
					// Agrego uno antes con estado X
					KYCPersJur kycPersJur = new KYCPersJur();
					EstadoKYC estadoKYC = new EstadoKYC();
					estadoKYC.setCodigo("X");
					kycPersJur.setEstadoKYC(estadoKYC);
					kycPersJurListAIS.add(0, kycPersJur);
				} else if (kycPersJurListAIS.get(0).getEstadoKYC().getCodigo().equalsIgnoreCase("X")) {
					// Es un alta (no trae datos precargados)
					// Agrego uno antes con estado X
					KYCPersJur kycPersJur = new KYCPersJur();
					EstadoKYC estadoKYC = new EstadoKYC();
					estadoKYC.setCodigo("X");
					kycPersJur.setEstadoKYC(estadoKYC);
					kycPersJurListAIS.add(0, kycPersJur);
				} else if (kycPersJurListAIS.get(0).getEstadoKYC().getCodigo().equalsIgnoreCase("")) {
					// No es un alta (no tiene kyc aprobados)
					// Cambio el estado a X y llamo al segundo
					kycPersJurListAIS.get(0).getEstadoKYC().setCodigo("X");
					// Segunda llamada
					kycPersJurListAIS.add(this.getJMSCommService().getKYCPersJur(2, numeroCUIT,
							UtilFormat.getValChars(razonSocial)));
				} else {
					// No es un alta (tiene kyc aprobados)
					// Dejo como esta y llamo al segundo
					// Segunda llamada
					kycPersJurListAIS.add(this.getJMSCommService().getKYCPersJur(2, numeroCUIT,
							UtilFormat.getValChars(razonSocial)));
					// Si no tiene uno en proceso lo pongo en estado N
					if (kycPersJurListAIS.get(1).getEstadoKYC().getCodigo().equalsIgnoreCase("")) {
						kycPersJurListAIS.get(1).getEstadoKYC().setCodigo("N");
					}
				}
			} else {
				return kycPersJurListAIS;
			}
		} catch (Exception e) {
			KYCServiceImpl.logger.error(e);
		}

		// Datos recuperados (Solo perfil OPERADOR)
		if (au.getProfileKey().equalsIgnoreCase(KYCSegConstants.KYCS_USRPROF_OPE)) {
			// Si la segunda es N la reemplazo por la recuperada
			if (kycPersJurListAIS.get(1).getEstadoKYC().getCodigo().equalsIgnoreCase("N")) {
				// Recupero de la BD
				List<KYCPersJur> kycPersJurListREC = this.getKYCDao().getKYCPersJur(numeroCUIT);
				// Si recupero
				if (kycPersJurListREC.size() > 0) {
					// Determinar cual reemplazar
					Integer indexRec = 0;
					if (kycPersJurListAIS.get(0).getEstadoKYC().getCodigo().equalsIgnoreCase("X")) {
						indexRec = 2;
					} else {
						indexRec = 0;
					}

					// Agregar la recuperada
					kycPersJurListAIS.add(indexRec, kycPersJurListREC.get(0));
					// Copiar algunos datos de la original
					kycPersJurListAIS.get(indexRec).setEstadoKYC(kycPersJurListAIS.get(1).getEstadoKYC());
					kycPersJurListAIS
							.get(indexRec)
							.getEstadoKYC()
							.setDescripcion(
									kycPersJurListAIS.get(indexRec).getEstadoKYC().getDescripcion() + " (RECUPERADO)");
					kycPersJurListAIS.get(indexRec).setTipoOperacion(kycPersJurListAIS.get(1).getTipoOperacion());
					kycPersJurListAIS.get(indexRec).setVigenciaDesde(kycPersJurListAIS.get(1).getVigenciaDesde());
					kycPersJurListAIS.get(indexRec).setVigenciaHasta(kycPersJurListAIS.get(1).getVigenciaHasta());
					kycPersJurListAIS.get(indexRec).setOperador(kycPersJurListAIS.get(1).getOperador());
					kycPersJurListAIS.get(indexRec).setOpeFechaUpd(kycPersJurListAIS.get(1).getOpeFechaUpd());
					kycPersJurListAIS.get(indexRec).setSupervisor(kycPersJurListAIS.get(1).getSupervisor());
					kycPersJurListAIS.get(indexRec).setSupFechaUpd(kycPersJurListAIS.get(1).getSupFechaUpd());
					kycPersJurListAIS.get(indexRec).setCompliance(kycPersJurListAIS.get(1).getCompliance());
					kycPersJurListAIS.get(indexRec).setComFechaUpd(kycPersJurListAIS.get(1).getComFechaUpd());
					kycPersJurListAIS.get(indexRec).setEsSCCenAIS(kycPersJurListAIS.get(1).getEsSCCenAIS());
					kycPersJurListAIS.get(indexRec).setPrimaAnualenAIS(kycPersJurListAIS.get(1).getPrimaAnualenAIS());
					kycPersJurListAIS.get(indexRec).setPerfilObligenAIS(kycPersJurListAIS.get(1).getPerfilObligenAIS());
					// Borrar la original
					kycPersJurListAIS.remove(1);
				}
			}
		}

		return kycPersJurListAIS;
	}

	public Boolean setKYCPersJur(final Integer cache, final Long numeroCUIT, final String razonSocial,
			final Integer fechaConstitucion, final String dirCalle, final String dirNumero, final String dirPiso,
			final String dirDepto, final Integer dirProvincia, final String dirLocalidad, final String dirCodigoPostal,
			final String telefono, final String email, final String representanteList, final Boolean esTitMPago,
			final String titMPagoList, final Integer actividadCod, final String actividadNom, final String actividadDes,
			final String propositoDes, final Integer caracterCod, final String caracterDes, final Boolean esClienteBco,
			final Boolean cotizaBolsa, final Boolean subsCiaCotizaBolsa, final Boolean cliRegOrganismo, final Boolean esSCC,
			final String motivoSCC, final Boolean tieneRepSCC, final String accionistas, final String companiaList,
			final Boolean tieneRelHSBC, final String relDetalle, final Integer inicioAnn, final String balAuditor,
			final Integer balFecha, final Double balActivo, final Double balPasivo, final Double balPatNeto,
			final Double balVentas, final Double balResFinal, final Integer balFechaEstContable, final String docResDetalle,
			final String observaciones, final Double valorOperar, final Double primaAnual, final String valorOperarMot,
			final String perfilComentarios, final Integer ultFecha, final String opeInusualList, final String opePeopleSoft,
			final String opeApellido, final String opeNombre) {
		// KYC PF
		KYCPersJur kycPersJur = new KYCPersJur();
		kycPersJur.setNumeroCUIT(numeroCUIT);
		kycPersJur.setRazonSocial(UtilFormat.getValChars(razonSocial));
		kycPersJur.setFechaConstitucion(fechaConstitucion);
		kycPersJur.setDirCalle(UtilFormat.getValChars(dirCalle));
		kycPersJur.setDirNumero(dirNumero);
		kycPersJur.setDirPiso(dirPiso);
		kycPersJur.setDirDepto(dirDepto);
		Provincia provincia = new Provincia();
		provincia.setId(dirProvincia);
		kycPersJur.setDirProvincia(provincia);
		kycPersJur.setDirLocalidad(UtilFormat.getValChars(dirLocalidad));
		kycPersJur.setDirCodigoPostal(dirCodigoPostal);
		kycPersJur.setTelefono(telefono);
		kycPersJur.setEmail(email);
		kycPersJur.setRepresentanteList(parseRepresentante(representanteList));
		kycPersJur.setEsTitMPago(esTitMPago);
		kycPersJur.setTitMPagoList(parseTitMPagoList(titMPagoList));
		Actividad actividad = new Actividad();
		actividad.setId(actividadCod);
		actividad.setName(UtilFormat.getValChars(actividadNom));
		kycPersJur.setActividad(actividad);
		kycPersJur.setActividadDes(UtilFormat.getValChars(actividadDes));
		kycPersJur.setPropositoDes(UtilFormat.getValChars(propositoDes));
		Caracter caracter = new Caracter();
		caracter.setId(caracterCod);
		kycPersJur.setCaracter(caracter);
		kycPersJur.setCaracterDes(UtilFormat.getValChars(caracterDes));
		kycPersJur.setEsClienteBco(esClienteBco);
		kycPersJur.setCotizaBolsa(cotizaBolsa);
		kycPersJur.setSubsCiaCotizaBolsa(subsCiaCotizaBolsa);
		kycPersJur.setCliRegOrganismo(cliRegOrganismo);
		kycPersJur.setEsSCC(esSCC);
		kycPersJur.setMotivoSCC(UtilFormat.getValChars(motivoSCC));
		kycPersJur.setTieneRepSCC(tieneRepSCC);
		kycPersJur.setAccionistas(UtilFormat.getValChars(accionistas));
		kycPersJur.setCompaniaList(parseCompania(companiaList));
		kycPersJur.setTieneRelHSBC(tieneRelHSBC);
		kycPersJur.setRelDetalle(UtilFormat.getValChars(relDetalle));
		kycPersJur.setInicioAnn(inicioAnn);
		kycPersJur.setBalAuditor(UtilFormat.getValChars(balAuditor));
		kycPersJur.setBalFecha(balFecha);
		kycPersJur.setBalActivo(balActivo);
		kycPersJur.setBalPasivo(balPasivo);
		kycPersJur.setBalPatNeto(balPatNeto);
		kycPersJur.setBalVentas(balVentas);
		kycPersJur.setBalResFinal(balResFinal);
		kycPersJur.setBalFechaEstContable(balFechaEstContable);
		kycPersJur.setDocResDetalle(UtilFormat.getValChars(docResDetalle));
		kycPersJur.setObservaciones(UtilFormat.getValChars(observaciones));
		kycPersJur.setValorOperar(valorOperar);
		kycPersJur.setPrimaAnual(primaAnual);
		kycPersJur.setValorOperarMot(UtilFormat.getValChars(valorOperarMot));
		kycPersJur.setPerfilComentarios(UtilFormat.getValChars(perfilComentarios));
		kycPersJur.setUltFecha(ultFecha);
		kycPersJur.setOpeInusualList(parseOpeInusualList(opeInusualList));
		// Operador
		AuthorizedUser operador = new AuthorizedUser();
		operador.setPeopleSoft(opePeopleSoft);
		operador.setlName(UtilFormat.getValChars(opeApellido));
		operador.setfName(UtilFormat.getValChars(opeNombre));
		operador.setProfileKey(KYCSegConstants.KYCS_USRPROF_OPE);

		return this.getKYCDao().setKYCPersJur(kycPersJur, operador);
	}

	public KYCSetResp setKYCPersJurAIS(final HttpServletRequest httpServletRequest, final Integer cache,
			final Long numeroCUIT, final String tipoOperacion, final Boolean actPerfilTrans, final Boolean esKYCNuevo,
			final Integer vigenciaDesde, final Integer vigenciaHasta, final Boolean perfilObligenAIS,
			final String supPeopleSoft, final String supApellido, final String supNombre) {
		KYCSetResp kycSetResp = null;

		// Recupero el recien grabado
		List<KYCPersJur> kycPersJurList = this.getKYCDao().getKYCPersJur(numeroCUIT);
		// Obtengo los usuarios
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser operador = (AuthorizedUser) session.getAttribute("authorizedUser");
		AuthorizedUser supervisor = new AuthorizedUser();
		supervisor.setPeopleSoft(supPeopleSoft);
		supervisor.setlName(UtilFormat.getValChars(supApellido));
		supervisor.setfName(UtilFormat.getValChars(supNombre));
		supervisor.setProfileKey(KYCSegConstants.KYCS_USRPROF_SUP);
		// Llamo al mensaje
		kycSetResp = this.getJMSCommService().setKYCPersJur(kycPersJurList.get(0), tipoOperacion, actPerfilTrans,
				esKYCNuevo, vigenciaDesde, vigenciaHasta, perfilObligenAIS, operador, supervisor);
		// Si esta OK borro el temporal
		if (kycSetResp != null) {
			if (kycSetResp.getEstadoGra() == 0) {
				this.getKYCDao().delKYCPersJur(numeroCUIT);
			}
		}

		return kycSetResp;
	}

	private List<Representante> parseRepresentante(final String representanteList) throws JSONException {
		List<Representante> repList = new ArrayList<Representante>();

		try {
			JSONObject jsonObject = new JSONObject(representanteList);
			JSONArray jsonArray = jsonObject.getJSONArray("representanteList");
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject jsonData = jsonArray.getJSONObject(i);
				Representante rep = new Representante();
				TipoDoc td = new TipoDoc();
				td.setId(jsonData.getInt("tipoDoc"));
				rep.setTipoDoc(td);
				rep.setNumeroDoc(jsonData.getInt("numeroDoc"));
				rep.setApellido(UtilFormat.getValChars(jsonData.getString("apellido")));
				rep.setNombre(UtilFormat.getValChars(jsonData.getString("nombre")));
				rep.setEsSCC(jsonData.getBoolean("esSCC"));
				rep.setCargo(UtilFormat.getValChars(jsonData.getString("cargo")));
				rep.setEsPEP(jsonData.getBoolean("esPEP"));
				rep.setFechaConstitNacim(jsonData.getInt("fechaConstitNacim"));
				repList.add(rep);
			}
		} catch (JSONException e) {
			throw new JSONException(e.getMessage());
		}

		return repList;
	}

	private List<TitularMedioPago> parseTitMPagoList(final String titMPagoList) throws JSONException {
		List<TitularMedioPago> titMPgList = new ArrayList<TitularMedioPago>();

		try {
			JSONObject jsonObject = new JSONObject(titMPagoList);
			JSONArray jsonArray = jsonObject.getJSONArray("titMPagoList");
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject jsonData = jsonArray.getJSONObject(i);
				TitularMedioPago tmp = new TitularMedioPago();
				TipoDoc td = new TipoDoc();
				td.setId(jsonData.getInt("tipoDoc"));
				tmp.setTipoDoc(td);
				tmp.setNumeroDoc(jsonData.getLong("numeroDoc"));
				tmp.setApellido(UtilFormat.getValChars(jsonData.getString("apellido")));
				tmp.setNombre(UtilFormat.getValChars(jsonData.getString("nombre")));
				tmp.setMedioPago(UtilFormat.getValChars(jsonData.getString("medioPago")));
				titMPgList.add(tmp);
			}
		} catch (JSONException e) {
			throw new JSONException(e.getMessage());
		}

		return titMPgList;
	}

	private List<Compania> parseCompania(final String companiaList) throws JSONException {
		List<Compania> ciaList = new ArrayList<Compania>();

		try {
			JSONObject jsonObject = new JSONObject(companiaList);
			JSONArray jsonArray = jsonObject.getJSONArray("companiaList");
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject jsonData = jsonArray.getJSONObject(i);
				Compania cia = new Compania();
				cia.setSecuencia(jsonData.getInt("secuencia"));
				cia.setRazonSocial(UtilFormat.getValChars(jsonData.getString("razonSocial")));
				cia.setEsSCC(jsonData.getBoolean("esSCC"));
				cia.setFechaConstitucion(jsonData.getInt("fechaConstitucion"));
				ciaList.add(cia);
			}
		} catch (JSONException e) {
			throw new JSONException(e.getMessage());
		}

		return ciaList;
	}

	private List<OperacionInusual> parseOpeInusualList(final String opeInusualList) throws JSONException {
		List<OperacionInusual> oinList = new ArrayList<OperacionInusual>();

		try {
			JSONObject jsonObject = new JSONObject(opeInusualList);
			JSONArray jsonArray = jsonObject.getJSONArray("opeInusualList");
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject jsonData = jsonArray.getJSONObject(i);
				OperacionInusual oin = new OperacionInusual();
				oin.setSecuencia(jsonData.getInt("secuencia"));
				oin.setFecha(jsonData.getInt("fecha"));
				oin.setTipoOperacion(UtilFormat.getValChars(jsonData.getString("tipoOperacion")));
				oin.setOrigenFondos(UtilFormat.getValChars(jsonData.getString("origenFondos")));
				oin.setMonto(jsonData.getDouble("monto"));
				oin.setObservacion(UtilFormat.getValChars(jsonData.getString("observacion")));
				oinList.add(oin);
			}
		} catch (JSONException e) {
			throw new JSONException(e.getMessage());
		}

		return oinList;
	}

	public List<KYCPendiente> getKYCPendienteList(final Integer cache, final String estadoKYC, final String profileKey,
			final String peopleSoft) {
		return this.getJMSCommService().getKYCPendienteList(estadoKYC, profileKey, peopleSoft);
	}

	public KYCSetResp setKYCPendiente(final Integer cache, final Long numeroCUIL, final String tipoOperacion,
			final String estadoKYC, final String profileKey, final String peopleSoft, final String lName,
			final String fName, final Double primaAnual, final Integer categCliente, final String categCGS,
			final String comentario) {
		AuthorizedUser user = new AuthorizedUser();
		user.setProfileKey(profileKey);
		user.setPeopleSoft(peopleSoft);
		user.setlName(UtilFormat.getValChars(lName));
		user.setfName(UtilFormat.getValChars(fName));
		return this.getJMSCommService().setKYCPendiente(numeroCUIL, tipoOperacion, estadoKYC, user, primaAnual,
				categCliente, categCGS, UtilFormat.getValChars(comentario));
	}
}
