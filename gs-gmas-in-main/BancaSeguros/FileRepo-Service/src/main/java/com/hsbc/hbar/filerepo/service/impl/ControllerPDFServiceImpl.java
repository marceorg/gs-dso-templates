/*
 * COPYRIGHT. HSBC HOLDINGS PLC 2018. ALL RIGHTS RESERVED.
 *
 * This software is only to be used for the purpose for which it has been
 * provided. No part of it is to be reproduced, disassembled, transmitted,
 * stored in a retrieval system nor translated in any human or computer
 * language in any way or for any other purposes whatsoever without the
 * prior written consent of HSBC Holdings plc.
 */
package com.hsbc.hbar.filerepo.service.impl;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import com.hsbc.hbar.filerepo.model.common.AuthorizedUser;
import com.hsbc.hbar.filerepo.model.constant.FRConstants;
import com.hsbc.hbar.filerepo.model.enums.DestinationEnum;
import com.hsbc.hbar.filerepo.model.enums.MdwEnum;
import com.hsbc.hbar.filerepo.service.MdwService;
import com.hsbc.hbar.filerepo.service.UserValidationService;
import com.hsbc.hbar.filerepo.service.UtilCommService;
import com.hsbc.hbar.filerepo.service.utils.UtilFormat;

public class ControllerPDFServiceImpl implements Controller {
	static Logger logger = LogManager.getLogger(ControllerPDFServiceImpl.class);

	private UtilCommService utilCommService;
	private MdwService mdwService;
	private UserValidationService userValidationService;

	public UtilCommService getUtilCommService() {
		if (this.utilCommService == null) {
			this.utilCommService = (UtilCommService) ServiceFactory.getContext().getBean("UtilCommService");
		}
		return this.utilCommService;
	}

	public void setUtilCommService(final UtilCommService utilCommService) {
		this.utilCommService = utilCommService;
	}

	public MdwService getMdwService() {
		if (this.mdwService == null) {
			this.mdwService = (MdwService) ServiceFactory.getContext().getBean("MdwService");
		}
		return this.mdwService;
	}

	public void setMdwService(final MdwService mdwService) {
		this.mdwService = mdwService;
	}

	public UserValidationService getUserValidationService() {
		if (this.userValidationService == null) {
			this.userValidationService = (UserValidationService) ServiceFactory.getContext()
					.getBean("UserValidationService");
		}
		return this.userValidationService;
	}

	public void setUserValidationService(final UserValidationService userValidationService) {
		this.userValidationService = userValidationService;
	}

	public ModelAndView handleRequest(final HttpServletRequest httpServletRequest,
			final HttpServletResponse httpServletResponse) throws ServletException, IOException {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		String ret = "";
		String strB64 = "";
		try {
			// Parametros
			String tipo = "";
			String xmlData = "";
			String reportID = "";
			String producto = "";
			String solicitud = "";
			String arcTDoc = "";
			String arcNDoc = "";
			// Validacion
			if (httpServletRequest.getParameterMap().containsKey("hOBPPDFTIP")) {
				tipo = httpServletRequest.getParameter("hOBPPDFTIP");
			}
			if (httpServletRequest.getParameterMap().containsKey("hOBPPDFXML")) {
				xmlData = httpServletRequest.getParameter("hOBPPDFXML");
				xmlData = UtilFormat.getValChars(xmlData);
				xmlData = new String(Base64.decodeBase64(xmlData));
			}
			if (httpServletRequest.getParameterMap().containsKey("hOBPPDFRID")) {
				reportID = httpServletRequest.getParameter("hOBPPDFRID");
				reportID = UtilFormat.getValChars(reportID);
			}
			if (httpServletRequest.getParameterMap().containsKey("hOBPPDFPRO")) {
				producto = httpServletRequest.getParameter("hOBPPDFPRO");
				producto = UtilFormat.getValChars(producto);
			}
			if (httpServletRequest.getParameterMap().containsKey("hOBPPDFSOL")) {
				solicitud = httpServletRequest.getParameter("hOBPPDFSOL");
				solicitud = UtilFormat.getValChars(solicitud);
			}
			if (httpServletRequest.getParameterMap().containsKey("hOBPPDFTDO")) {
				arcTDoc = httpServletRequest.getParameter("hOBPPDFTDO");
				arcTDoc = UtilFormat.getValChars(arcTDoc);
			}
			if (httpServletRequest.getParameterMap().containsKey("hOBPPDFNDO")) {
				arcNDoc = httpServletRequest.getParameter("hOBPPDFNDO");
				arcNDoc = UtilFormat.getValChars(arcNDoc);
			}
			// Obtener binario b64
			strB64 = this.getUtilCommService().generatePDFReport(xmlData, reportID);
			// Armar el retorno
			OutputStream responseOutputStream = null;
			if (tipo.equalsIgnoreCase("V")) {
				// Devolver archivo
				if (ret.isEmpty()) {
					// Otros archivos
					byte[] bB64 = Base64.decodeBase64(strB64);
					httpServletResponse.setContentType(FRConstants.TA_APP_PDF);
					responseOutputStream = httpServletResponse.getOutputStream();
					responseOutputStream.write(bB64);
				} else {
					// Si hay errores
					httpServletResponse.setContentType("text/html");
					responseOutputStream = httpServletResponse.getOutputStream();
					ret = "<label style=\"\">" + ret + "</label>";
					responseOutputStream.write(ret.getBytes());
				}
			} else if (tipo.equalsIgnoreCase("A")) {
				// Validacion de permisos
				if (au != null) {
					if (!getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "A")) {
						ret = FRConstants.FR_SER_UNA;
					} else if (!getUserValidationService().getSolicitudGrant(producto, solicitud, au.getProfileKey(),
							au.getPeopleSoft())) {
						ret = FRConstants.FR_SER_SNA;
					} else {
						JSONObject request = new JSONObject();
						request.put("COD_PRO", producto);
						request.put("NRO_SOL", solicitud);
						request.put("COD_TDO", "3");
						request.put("TIP_ARC", FRConstants.TA_APP_PDF);
						request.put("COD_USU", au.getPeopleSoft());
						request.put("APE_USU", au.getlName());
						request.put("NOM_USU", au.getfName());
						request.put("ARC_TDO", arcTDoc);
						request.put("ARC_NDO", arcNDoc);
						request.put("ARC_DA1", "");
						request.put("ARC_DA2", "");
						request.put("ARC_DA3", "");
						request.put("ARC_DA4", "");
						request.put("OBS_ARC", "");
						request.put("CON_ARC", strB64);
						String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP,
								MdwEnum.SP_FR_OPE_ARCXSOL_INS, request.toString());
						JSONObject jsonObject = new JSONObject(response);
						if (!jsonObject.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
							ret = FRConstants.FR_SER_UPE;
						} else {
							ret = FRConstants.FR_SER_NER;
						}
					}
				} else {
					ret = FRConstants.FR_SER_UNF;
				}
				// Armar respuesta
				httpServletResponse.setContentType("text/html");
				responseOutputStream = httpServletResponse.getOutputStream();
				ret = "{\"Code\":\"" + ret + "\"}";
				responseOutputStream.write(ret.getBytes());
			} else {
				// Si esta mal el parametro
				httpServletResponse.setContentType("text/html");
				responseOutputStream = httpServletResponse.getOutputStream();
				ret = "<label style=\"\">PARAMETRO INVALIDO (PDFTIP)</label>";
				responseOutputStream.write(ret.getBytes());
			}
			responseOutputStream.flush();
			responseOutputStream.close();
		} catch (Exception e) {
			ControllerPDFServiceImpl.logger.error(e);
		}
		// Return
		return new ModelAndView("retrieveSvc");
	}
}
