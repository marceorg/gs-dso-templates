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
import com.hsbc.hbar.filerepo.model.constant.MsgConstants;
import com.hsbc.hbar.filerepo.model.enums.DestinationEnum;
import com.hsbc.hbar.filerepo.model.enums.MdwEnum;
import com.hsbc.hbar.filerepo.service.MdwService;
import com.hsbc.hbar.filerepo.service.UserValidationService;
import com.hsbc.hbar.filerepo.service.utils.UtilFormat;

public class ControllerDwlServiceImpl implements Controller {
	static Logger logger = LogManager.getLogger(ControllerDwlServiceImpl.class);

	private MdwService mdwService;
	private UserValidationService userValidationService;

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
		byte[] bB64 = null;
		try {
			// Parametros
			String proceso = "";
			String archivo = "";
			String tipoArchivo = "";
			String extension = "";
			// Validacion
			if (httpServletRequest.getParameterMap().containsKey("proceso")) {
				proceso = httpServletRequest.getParameter("proceso");
			}
			if (httpServletRequest.getParameterMap().containsKey("archivo")) {
				archivo = httpServletRequest.getParameter("archivo");
				archivo = UtilFormat.getValChars(archivo);
			}
			if (httpServletRequest.getParameterMap().containsKey("tipoArchivo")) {
				tipoArchivo = httpServletRequest.getParameter("tipoArchivo");
				tipoArchivo = UtilFormat.getValChars(tipoArchivo);
			}
			if (httpServletRequest.getParameterMap().containsKey("extension")) {
				extension = httpServletRequest.getParameter("extension");
				extension = UtilFormat.getValChars(extension);
			}
			// Validacion de permisos
			if (au != null) {
				// Valida permiso solo para SOL
				if (proceso.equalsIgnoreCase("SOL")
						&& !getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "L")) {
					ret = FRConstants.FR_SER_UNA;
				} else {
					try {
						JSONObject request = new JSONObject();
						request.put("NRO_ARC", Long.parseLong(archivo));
						String response = null;
						if (proceso.equalsIgnoreCase("SOL")) {
							response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCHIVO_SEL,
									request.toString());
						} else if (proceso.equalsIgnoreCase("SIN")) {
							response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SINARCH_SEL,
									request.toString());
						} else if (proceso.equalsIgnoreCase("DBE")) {
							response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_BENARCH_SEL,
									request.toString());
						} else if (proceso.equalsIgnoreCase("RCO")) {
							response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_RCOARCH_SEL,
									request.toString());
						}
						JSONObject jsonObject = new JSONObject(response);
						if (!jsonObject.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
							ret = FRConstants.FR_SER_FNF;
						} else {
							// Obtener binario b64
							String strB64 = jsonObject.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
									.getJSONArray(MsgConstants.MC_REG).getJSONObject(0).getString("CON_ARC");
							bB64 = Base64.decodeBase64(strB64);
						}
					} catch (Exception e) {
						ControllerDwlServiceImpl.logger.error(e);
						ret = FRConstants.FR_SER_EXE;
					}
				}
			} else {
				ret = FRConstants.FR_SER_UNF;
			}
			// Devolver archivo
			OutputStream responseOutputStream = null;
			if (ret.isEmpty()) {
				if (tipoArchivo.equalsIgnoreCase("audio/mp3")) {
					// Si es MP3
					httpServletResponse.setContentType(FRConstants.TA_APP_OST);
					httpServletResponse.setHeader("Content-Disposition", "attachment;filename=download.mp3");
					responseOutputStream = httpServletResponse.getOutputStream();
					responseOutputStream.write(bB64);
				} else if (tipoArchivo.equalsIgnoreCase(FRConstants.TA_APP_OST)) {
					// Si es Otro
					httpServletResponse.setContentType(FRConstants.TA_APP_OST);
					httpServletResponse.setHeader("Content-Disposition", "attachment;filename=download." + extension);
					responseOutputStream = httpServletResponse.getOutputStream();
					responseOutputStream.write(bB64);
				} else {
					// Archivos jpg/png/pdf
					httpServletResponse.setContentType(tipoArchivo);
					responseOutputStream = httpServletResponse.getOutputStream();
					responseOutputStream.write(bB64);
				}
			} else {
				// Si hay errores
				httpServletResponse.setContentType("text/html");
				responseOutputStream = httpServletResponse.getOutputStream();
				ret = "<label style=\"\">" + ret + "</label>";
				responseOutputStream.write(ret.getBytes());
			}
			responseOutputStream.flush();
			responseOutputStream.close();
		} catch (Exception e) {
			ControllerDwlServiceImpl.logger.error(e);
		}
		// Return
		return new ModelAndView("downloadSvc");
	}
}
