/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2014. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the prior
 * written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.bancaseg.service.impl;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import com.hsbc.hbar.bancaseg.model.bs.Denuncia;
import com.hsbc.hbar.bancaseg.model.bs.Reclamo;
import com.hsbc.hbar.bancaseg.model.common.AuthorizedUser;
import com.hsbc.hbar.bancaseg.service.JMSCommService;
import com.hsbc.hbar.bancaseg.service.UtilCommService;
import com.hsbc.hbar.bancaseg.service.utils.UtilFormat;
import com.hsbc.hbar.bancaseg.service.utils.XMLConvert;

public class ControllerPDFServiceImpl implements Controller {
	static Logger logger = LogManager.getLogger(ControllerPDFServiceImpl.class);

	private JMSCommService jmsCommService;
	private UtilCommService utilCommService;

	public JMSCommService getJMSCommService() {
		if (this.jmsCommService == null) {
			this.jmsCommService = (JMSCommService) ServiceFactory.getContext().getBean("JMSCommService");
		}
		return this.jmsCommService;
	}

	public void setJMSCommService(final JMSCommService jmsCommService) {
		this.jmsCommService = jmsCommService;
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

	public ModelAndView handleRequest(final HttpServletRequest request, final HttpServletResponse response)
			throws ServletException, IOException {

		byte[] bPDF = null;
		String b64PDF = "";
		try {
			// Orden
			String tipo = request.getParameterValues("tipo")[0];
			Long orden = Long.parseLong(request.getParameterValues("orden")[0]);
			String archAdj = "";
			if (request.getParameterValues("archAdj") != null) {
				archAdj = request.getParameterValues("archAdj")[0];
			}
			if (tipo.equalsIgnoreCase("I")) {
				// BIRT (IMPRESO)
				// Obtengo la denuncia y genero un XML
				Denuncia denuncia = new Denuncia();
				denuncia = this.getJMSCommService().getOpeSiniestro(orden);
				// Formatear XML, agregar campos requeridos
				String xml = XMLConvert.getDenunciaXML4PDF(denuncia);
				// Genera PDF
				b64PDF = this.getUtilCommService().generatePDFReport(xml, "BS_Denuncia");
			} else if (tipo.equalsIgnoreCase("R")) {
				// BIRT (IMPRESO Reclamo)
				Reclamo reclamo = new Reclamo();
				reclamo.setOrden(orden);
				reclamo.setCompania(request.getParameterValues("compania")[0]);
				reclamo.setProducto(request.getParameterValues("producto")[0]);
				reclamo.setPoliza(request.getParameterValues("poliza")[0]);
				reclamo.setEndoso(Integer.parseInt(request.getParameterValues("endoso")[0]));
				String tomador = UtilFormat.getValChars(request.getParameterValues("tomador")[0]);
				reclamo.setTomador(tomador);
				reclamo.setTipDoc(request.getParameterValues("tipDoc")[0]);
				reclamo.setNroDoc(request.getParameterValues("nroDoc")[0]);
				reclamo.setFechaPedido(Integer.parseInt(request.getParameterValues("fechaPedido")[0]));
				reclamo.setTipReg(request.getParameterValues("tipReg")[0]);
				reclamo.setMotRec(request.getParameterValues("motRec")[0]);
				String descRec = UtilFormat.getValChars(request.getParameterValues("descRec")[0]);
				reclamo.setDescRec(descRec);
				String telefono = UtilFormat.getValChars(request.getParameterValues("telefono")[0]);
				reclamo.setTelefono(telefono);
				String email = UtilFormat.getValChars(request.getParameterValues("email")[0]);
				reclamo.setEmail(email);
				reclamo.setPeopleSoft(request.getParameterValues("peopleSoft")[0]);
				// Formatear XML, agregar campos requeridos
				String xml = XMLConvert.getReclamoXML4PDF(reclamo);
				// Genera PDF
				b64PDF = this.getUtilCommService().generatePDFReport(xml, "BS_Pedido");
			} else if (tipo.equalsIgnoreCase("A")) {
				// Coldview (ADJUNTO)
				b64PDF = this.getUtilCommService().retrieveReport(orden, archAdj);
			} else if (tipo.equalsIgnoreCase("P")) {
				// LLamada al WS Impresion poliza
				String poliza = request.getParameterValues("poliza")[0];
				// Obtengo usuario de sesion
				HttpSession session = request.getSession(true);
				AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
				String peoplesoft = au.getPeopleSoft();
				String token = au.getToken();
				// LLamada al WS QBE (orden: 0=poliza, 2=cert.mercosur)
				if (orden == 0 || orden == 2) {
					b64PDF = this.getUtilCommService().retrieveQBEDocuments(peoplesoft, token, poliza, orden);
				}
				// LLamada al WS NylPrinting
				if (orden == 1) {
					b64PDF = this.getUtilCommService().generateAndReturnPdfReport(poliza);
				}
			}

			bPDF = Base64.decodeBase64(b64PDF);
			response.setContentType("application/pdf");
			OutputStream responseOutputStream = response.getOutputStream();
			responseOutputStream.write(bPDF);
			responseOutputStream.flush();
			responseOutputStream.close();
		} catch (Exception e) {
			ControllerPDFServiceImpl.logger.error(e);
		}

		return new ModelAndView("retrieveSvc");
	}
}