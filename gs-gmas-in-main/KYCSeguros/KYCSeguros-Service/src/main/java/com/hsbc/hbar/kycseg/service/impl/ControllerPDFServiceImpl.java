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

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import com.hsbc.hbar.kycseg.model.common.DblConverter;
import com.hsbc.hbar.kycseg.model.kyc.Compania;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersFis;
import com.hsbc.hbar.kycseg.model.kyc.KYCPersJur;
import com.hsbc.hbar.kycseg.model.kyc.OperacionInusual;
import com.hsbc.hbar.kycseg.model.kyc.Representante;
import com.hsbc.hbar.kycseg.model.kyc.TitularMedioPago;
import com.hsbc.hbar.kycseg.service.JMSCommService;
import com.hsbc.hbar.kycseg.service.UtilCommService;
import com.hsbc.hbar.kycseg.service.utils.XMLConvert;
import com.thoughtworks.xstream.XStream;

public class ControllerPDFServiceImpl implements Controller {
	static Logger logger = LogManager.getLogger(ControllerPDFServiceImpl.class);

	private UtilCommService utilCommService;
	private JMSCommService jmsCommService;

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

	public ModelAndView handleRequest(final HttpServletRequest request, final HttpServletResponse response)
			throws ServletException, IOException {

		byte[] bPDF = null;
		String b64PDF = "";
		try {
			// Persona Fisica
			String tipoPersona = request.getParameterValues("tipoPersona")[0];
			if (tipoPersona.equalsIgnoreCase("F")) {
				// Obtengo el KYC y genero un XML
				Long numeroCUIL = Long.parseLong(request.getParameterValues("numeroCUIL")[0]);
				KYCPersFis kycPersFis = this.getJMSCommService().getKYCPersFis(1, numeroCUIL, "", "");
				XStream xstream = new XStream();
				xstream.alias("kycDatos", KYCPersFis.class);
				xstream.registerConverter(new DblConverter(), XStream.PRIORITY_VERY_HIGH);
				xstream.alias("representante", Representante.class);
				xstream.alias("titularMedioPago", TitularMedioPago.class);
				xstream.alias("operacionInusual", OperacionInusual.class);
				String xml = xstream.toXML(kycPersFis);
				// Formatear XML y agregar campos requeridos
				xml = XMLConvert.getKYCPersFisXML4PDF(xml);
				// Genera PDF
				b64PDF = this.getUtilCommService().generatePDFReport(xml, "KYCPersFis");
			} else if (tipoPersona.equalsIgnoreCase("J")) {
				// Obtengo el KYC y genero un XML
				Long numeroCUIT = Long.parseLong(request.getParameterValues("numeroCUIT")[0]);
				KYCPersJur kycPersJur = this.getJMSCommService().getKYCPersJur(1, numeroCUIT, "");
				XStream xstream = new XStream();
				xstream.alias("kycDatos", KYCPersJur.class);
				xstream.registerConverter(new DblConverter(), XStream.PRIORITY_VERY_HIGH);
				xstream.alias("representante", Representante.class);
				xstream.alias("titularMedioPago", TitularMedioPago.class);
				xstream.alias("compania", Compania.class);
				xstream.alias("operacionInusual", OperacionInusual.class);
				String xml = xstream.toXML(kycPersJur);
				// Formatear XML y agregar campos requeridos
				xml = XMLConvert.getKYCPersJurXML4PDF(xml);
				// Genera PDF
				b64PDF = this.getUtilCommService().generatePDFReport(xml, "KYCPersJur");
			}

			bPDF = Base64.decodeBase64(b64PDF);
			response.setContentType("application/pdf");
			OutputStream responseOutputStream = response.getOutputStream();
			responseOutputStream.write(bPDF);
			responseOutputStream.flush();
			responseOutputStream.close();
		} catch (IOException e) {
			ControllerPDFServiceImpl.logger.error(e);
		} catch (Exception e) {
			ControllerPDFServiceImpl.logger.error(e);
		}

		return new ModelAndView("generatePDF");
	}
}
