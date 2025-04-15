/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.kycseg.service.impl;

import java.util.List;

import javax.jms.JMSException;
import javax.jms.Queue;
import javax.jms.TextMessage;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.jms.core.JmsTemplate;

import com.hsbc.hbar.kycseg.dao.ParametersDao;
import com.hsbc.hbar.kycseg.model.common.Actividad;
import com.hsbc.hbar.kycseg.model.common.AuthorizedUser;
import com.hsbc.hbar.kycseg.model.common.Caracter;
import com.hsbc.hbar.kycseg.model.common.CategoriaGS;
import com.hsbc.hbar.kycseg.model.common.CondicionIVA;
import com.hsbc.hbar.kycseg.model.common.Pais;
import com.hsbc.hbar.kycseg.model.common.Provincia;
import com.hsbc.hbar.kycseg.model.common.TipoDoc;
import com.hsbc.hbar.kycseg.model.kyc.KYCPendiente;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersFis;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersJur;
import com.hsbc.hbar.kycseg.model.kyc.KYCSetResp;
import com.hsbc.hbar.kycseg.service.JMSCommService;
import com.hsbc.hbar.kycseg.service.utils.MsgCreator;
import com.hsbc.hbar.kycseg.service.utils.MsgFormatter;

public class JMSCommServiceImpl implements JMSCommService {
	static Logger logger = LogManager.getLogger(JMSCommServiceImpl.class);

	private JmsTemplate jmsTemplate;
	private Queue requestQueue;
	private Queue responseQueue;
	private ParametersDao parametersDao;

	public JmsTemplate getJmsTemplate() {
		return this.jmsTemplate;
	}

	public void setJmsTemplate(final JmsTemplate jmsTemplate) {
		this.jmsTemplate = jmsTemplate;
	}

	public Queue getRequestQueue() {
		return this.requestQueue;
	}

	public void setRequestQueue(final Queue queue) {
		this.requestQueue = queue;
	}

	public Queue getResponseQueue() {
		return this.responseQueue;
	}

	public void setResponseQueue(final Queue responseQueue) {
		this.responseQueue = responseQueue;
	}

	public ParametersDao getParametersDao() {
		if (this.parametersDao == null) {
			this.parametersDao = (ParametersDao) ServiceFactory.getContext().getBean("ParametersDao");
		}
		return this.parametersDao;
	}

	public void setParametersDao(final ParametersDao parametersDao) {
		this.parametersDao = parametersDao;
	}

	public Object sendAndReceive(final String request) {
		// Armar Mensaje MQ
		MsgCreator msgCreator = new MsgCreator();
		msgCreator.setRequest(request);
		this.jmsTemplate.send(this.requestQueue, msgCreator);
		String jmsMessageID = "";
		try {
			jmsMessageID = msgCreator.getMessage().getJMSMessageID();
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
			return null;
		}
		// Timeout 30seg
		this.jmsTemplate.setReceiveTimeout(30000);
		// Respuesta MQ
		return this.jmsTemplate.receiveSelected(this.responseQueue, "JMSMessageID='" + jmsMessageID + "'");
	}

	public List<Pais> getPaisList() {
		JMSCommServiceImpl.logger.info("Ejecutando getPaisList...");

		List<Pais> paisList = null;
		String request = MsgFormatter.reqMFGetPaisList();

		JMSCommServiceImpl.logger.info("AreaIN: " + request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info("AreaOUT: " + response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				paisList = MsgFormatter.resMFGetPaisList(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		} catch (Exception e) {
			JMSCommServiceImpl.logger.error(e);
		}
		return paisList;
	}

	public List<Actividad> getActividadList(final String filtroAct) {
		JMSCommServiceImpl.logger.info("Ejecutando getActividadList...");

		List<Actividad> actividadList = null;
		String request = MsgFormatter.reqMFGetActividadList(filtroAct);

		JMSCommServiceImpl.logger.info("AreaIN: " + request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info("AreaOUT: " + response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				actividadList = MsgFormatter.resMFGetActividadList(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		} catch (Exception e) {
			JMSCommServiceImpl.logger.error(e);
		}
		return actividadList;
	}

	public KYCPersFis getKYCPersFis(final Integer nroLlamada, final Long numeroCUIL, final String apellido,
			final String nombre) {
		JMSCommServiceImpl.logger.info("Ejecutando getKYCPersFis...");

		KYCPersFis kycPersFis = null;
		String request = MsgFormatter.reqMFGetKYCPersFis(nroLlamada, numeroCUIL, apellido, nombre);

		JMSCommServiceImpl.logger.info("AreaIN: " + request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info("AreaOUT: " + response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				kycPersFis = MsgFormatter.resMFGetKYCPersFis(response, numeroCUIL);
				// Setear descripciones
				getKYCPersFisFillDes(kycPersFis);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		} catch (Exception e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return kycPersFis;
	}

	public KYCSetResp setKYCPersFis(final KYCPersFis kycPersFis, final String tipoOperacion, final Boolean actPerfilTrans,
			final Boolean esKYCNuevo, final Integer vigenciaDesde, final Integer vigenciaHasta,
			final Boolean perfilObligenAIS, final AuthorizedUser operador, final AuthorizedUser supervisor) {
		JMSCommServiceImpl.logger.info("Ejecutando setKYCPersFis...");

		KYCSetResp kycSetResp = null;
		String request = MsgFormatter.reqMFSetKYCPersFis(kycPersFis, tipoOperacion, actPerfilTrans, esKYCNuevo,
				vigenciaDesde, vigenciaHasta, perfilObligenAIS, operador, supervisor);

		JMSCommServiceImpl.logger.info("AreaIN: " + request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info("AreaOUT: " + response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				kycSetResp = MsgFormatter.resMFSetKYCPersFis(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		} catch (Exception e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return kycSetResp;
	}

	public KYCPersJur getKYCPersJur(final Integer nroLlamada, final Long numeroCUIT, final String razonSocial) {
		JMSCommServiceImpl.logger.info("Ejecutando getKYCPersJur...");

		KYCPersJur kycPersJur = null;
		String request = MsgFormatter.reqMFGetKYCPersJur(nroLlamada, numeroCUIT, razonSocial);

		JMSCommServiceImpl.logger.info("AreaIN: " + request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info("AreaOUT: " + response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				kycPersJur = MsgFormatter.resMFGetKYCPersJur(response, numeroCUIT);
				// Setear descripciones
				getKYCPersJurFillDes(kycPersJur);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		} catch (Exception e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return kycPersJur;
	}

	public KYCSetResp setKYCPersJur(final KYCPersJur kycPersJur, final String tipoOperacion, final Boolean actPerfilTrans,
			final Boolean esKYCNuevo, final Integer vigenciaDesde, final Integer vigenciaHasta,
			final Boolean perfilObligenAIS, final AuthorizedUser operador, final AuthorizedUser supervisor) {
		JMSCommServiceImpl.logger.info("Ejecutando setKYCPersJur...");

		KYCSetResp kycSetResp = null;
		String request = MsgFormatter.reqMFSetKYCPersJur(kycPersJur, tipoOperacion, actPerfilTrans, esKYCNuevo,
				vigenciaDesde, vigenciaHasta, perfilObligenAIS, operador, supervisor);

		JMSCommServiceImpl.logger.info("AreaIN: " + request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info("AreaOUT: " + response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				kycSetResp = MsgFormatter.resMFSetKYCPersJur(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		} catch (Exception e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return kycSetResp;
	}

	public List<KYCPendiente> getKYCPendienteList(final String estadoKYC, final String profileKey, final String peopleSoft) {
		JMSCommServiceImpl.logger.info("Ejecutando getKYCPendienteList...");

		List<KYCPendiente> kycPendienteList = null;
		String request = MsgFormatter.reqMFGetKYCPendienteList(estadoKYC, profileKey, peopleSoft);

		JMSCommServiceImpl.logger.info("AreaIN: " + request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info("AreaOUT: " + response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				kycPendienteList = MsgFormatter.resMFGetKYCPendienteList(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return kycPendienteList;
	}

	public KYCSetResp setKYCPendiente(final Long numeroCUIL, final String tipoOperacion, final String estadoKYC,
			final AuthorizedUser user, final Double primaAnual, final Integer categCliente, final String categCGS,
			final String comentario) {
		JMSCommServiceImpl.logger.info("Ejecutando setKYCPendiente...");

		KYCSetResp kycSetResp = null;
		String request = MsgFormatter.reqMFSetKYCPendiente(numeroCUIL, tipoOperacion, estadoKYC, user, primaAnual,
				categCliente, categCGS, comentario);

		JMSCommServiceImpl.logger.info("AreaIN: " + request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info("AreaOUT: " + response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				kycSetResp = MsgFormatter.resMFSetKYCPendiente(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return kycSetResp;
	}

	private void getKYCPersFisFillDes(final KYCPersFis kycPersFis) {
		// Nacionalidad
		if (kycPersFis.getNacionalidad() != null) {
			List<Pais> paisList = null;
			try {
				paisList = this.getPaisList();
			} catch (Exception e) {
				JMSCommServiceImpl.logger.error(e);
			}
			kycPersFis.getNacionalidad().setName(getPaisDes(paisList, kycPersFis.getNacionalidad().getId()));
		}
		// Provincia
		if (kycPersFis.getDirProvincia() != null) {
			List<Provincia> provinciaList = this.getParametersDao().getProvinciaList();
			kycPersFis.getDirProvincia().setName(getProvinciaDes(provinciaList, kycPersFis.getDirProvincia().getId()));
		}
		// CondicionIVA
		if (kycPersFis.getCondicionIVA() != null) {
			List<CondicionIVA> condicionIVAList = this.getParametersDao().getCondicionIVAList();
			kycPersFis.getCondicionIVA().setName(getCondicionIVADes(condicionIVAList, kycPersFis.getCondicionIVA().getId()));
		}
		// Tipo de Documento
		List<TipoDoc> tipoDocList = this.getParametersDao().getTipoDocList();
		// Representantes
		if (kycPersFis.getRepresentanteList() != null) {
			for (int i = 0; i < kycPersFis.getRepresentanteList().size(); i++) {
				String tipoDocDes = getTipoDocDes(tipoDocList, kycPersFis.getRepresentanteList().get(i).getTipoDoc().getId());
				kycPersFis.getRepresentanteList().get(i).getTipoDoc().setName(tipoDocDes);
			}
		}
		// Titular Medio Pago
		if (kycPersFis.getTitMPagoList() != null) {
			for (int i = 0; i < kycPersFis.getTitMPagoList().size(); i++) {
				String tipoDocDes = getTipoDocDes(tipoDocList, kycPersFis.getTitMPagoList().get(i).getTipoDoc().getId());
				kycPersFis.getTitMPagoList().get(i).getTipoDoc().setName(tipoDocDes);
			}
		}
	}

	private void getKYCPersJurFillDes(final KYCPersJur kycPersJur) {
		// Provincia
		if (kycPersJur.getDirProvincia() != null) {
			List<Provincia> provinciaList = this.getParametersDao().getProvinciaList();
			kycPersJur.getDirProvincia().setName(getProvinciaDes(provinciaList, kycPersJur.getDirProvincia().getId()));
		}
		// Caracter
		if (kycPersJur.getCaracter() != null) {
			List<Caracter> caracterList = this.getParametersDao().getCaracterList();
			kycPersJur.getCaracter().setName(getCaracterDes(caracterList, kycPersJur.getCaracter().getId()));
		}
		// Tipo de Documento
		List<TipoDoc> tipoDocList = this.getParametersDao().getTipoDocList();
		// Representantes
		if (kycPersJur.getRepresentanteList() != null) {
			for (int i = 0; i < kycPersJur.getRepresentanteList().size(); i++) {
				String tipoDocDes = getTipoDocDes(tipoDocList, kycPersJur.getRepresentanteList().get(i).getTipoDoc().getId());
				kycPersJur.getRepresentanteList().get(i).getTipoDoc().setName(tipoDocDes);
			}
		}
		// Titular Medio Pago
		if (kycPersJur.getTitMPagoList() != null) {
			for (int i = 0; i < kycPersJur.getTitMPagoList().size(); i++) {
				String tipoDocDes = getTipoDocDes(tipoDocList, kycPersJur.getTitMPagoList().get(i).getTipoDoc().getId());
				kycPersJur.getTitMPagoList().get(i).getTipoDoc().setName(tipoDocDes);
			}
		}
	}

	private String getProvinciaDes(final List<Provincia> provinciaList, final Integer provinciaId) {
		if (provinciaList.size() > 0) {
			for (int i = 0; i < provinciaList.size(); i++) {
				if (provinciaList.get(i).getId() == provinciaId) {
					return provinciaList.get(i).getName();
				}
			}
		}
		return "";
	}

	private String getCondicionIVADes(final List<CondicionIVA> condicionIVAList, final Integer condicionIVAId) {
		if (condicionIVAList.size() > 0) {
			for (int i = 0; i < condicionIVAList.size(); i++) {
				if (condicionIVAList.get(i).getId() == condicionIVAId) {
					return condicionIVAList.get(i).getName();
				}
			}
		}
		return "";
	}

	private String getTipoDocDes(final List<TipoDoc> tipoDocList, final Integer tipoDocId) {
		if (tipoDocList.size() > 0) {
			for (int i = 0; i < tipoDocList.size(); i++) {
				if (tipoDocList.get(i).getId() == tipoDocId) {
					return tipoDocList.get(i).getName();
				}
			}
		}
		return "";
	}

	private String getCaracterDes(final List<Caracter> caracterList, final Integer caracterId) {
		if (caracterList.size() > 0) {
			for (int i = 0; i < caracterList.size(); i++) {
				if (caracterList.get(i).getId() == caracterId) {
					return caracterList.get(i).getName();
				}
			}
		}
		return "";
	}

	private String getPaisDes(final List<Pais> paisList, final Integer paisId) {
		if (paisList.size() > 0) {
			for (int i = 0; i < paisList.size(); i++) {
				if (paisList.get(i).getId() == paisId) {
					return paisList.get(i).getName();
				}
			}
		}
		return "";
	}

	public List<CategoriaGS> getCategoriasGSList(final Integer categoriaAIS) {
		JMSCommServiceImpl.logger.info("Ejecutando getCategoriasGSList...");

		List<CategoriaGS> categoriaGSList = null;
		String request = MsgFormatter.reqMFGetCategoriaGSList(categoriaAIS);

		JMSCommServiceImpl.logger.info("AreaIN: " + request);

		TextMessage textMessage = (TextMessage) sendAndReceive(request);
		try {
			String response = textMessage.getText();

			JMSCommServiceImpl.logger.info("AreaOUT: " + response);

			if (MsgFormatter.getEstado(response).equalsIgnoreCase("OK")
					|| MsgFormatter.getEstado(response).equalsIgnoreCase("TR")) {
				categoriaGSList = MsgFormatter.resMFGetCategoriaList(response);
			} else {
				JMSCommServiceImpl.logger.error("Error en la respuesta del AIS");
			}
		} catch (JMSException e) {
			JMSCommServiceImpl.logger.error(e);
		}

		return categoriaGSList;
	}

}