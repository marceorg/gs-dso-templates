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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
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
import com.hsbc.hbar.filerepo.service.utils.UtilFormat;

public class ControllerPubServiceImpl implements Controller {
	static Logger logger = LogManager.getLogger(ControllerPubServiceImpl.class);
	private static Integer TAMANO_MAXIMO = 10485760; // 10Mb

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
			// Archivo
			List<FileItem> items = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(httpServletRequest);
			for (FileItem item : items) {
				if (item.isFormField()) {
					// Process regular form field
				} else {
					// Process form file field (input type="file").
					InputStream fileContent = item.getInputStream();
					bB64 = getBytes(fileContent);
				}
			}
			// No permite archivo superiores al tamano maximo definido
			if (bB64.length <= ControllerPubServiceImpl.TAMANO_MAXIMO) {
				String contenido = Base64.encodeBase64String(bB64);
				// Parametros
				String proceso = "";
				String producto = "";
				String solicitud = "";
				String tipoDoc = "";
				String tipoArchivo = "";
				String arcTDoc = "";
				String arcNDoc = "";
				String arcDato1 = "";
				String arcDato2 = "";
				String arcDato3 = "";
				String arcDato4 = "";
				String arcObserv = "";
				String operacion = "";
				String arcDesc = "";
				String arcIde = "";
				// Validacion
				if (httpServletRequest.getParameterMap().containsKey("proceso")) {
					proceso = httpServletRequest.getParameter("proceso");
				}
				if (httpServletRequest.getParameterMap().containsKey("producto")) {
					producto = httpServletRequest.getParameter("producto");
					producto = UtilFormat.getValChars(producto);
				}
				if (httpServletRequest.getParameterMap().containsKey("solicitud")) {
					solicitud = httpServletRequest.getParameter("solicitud");
					solicitud = UtilFormat.getValChars(solicitud);
				}
				if (httpServletRequest.getParameterMap().containsKey("tipoDoc")) {
					tipoDoc = httpServletRequest.getParameter("tipoDoc");
					tipoDoc = UtilFormat.getValChars(tipoDoc);
				}
				if (httpServletRequest.getParameterMap().containsKey("tipoArchivo")) {
					tipoArchivo = httpServletRequest.getParameter("tipoArchivo");
					tipoArchivo = UtilFormat.getValChars(tipoArchivo);
				}
				if (httpServletRequest.getParameterMap().containsKey("arcTDoc")) {
					arcTDoc = httpServletRequest.getParameter("arcTDoc");
					arcTDoc = UtilFormat.getValChars(arcTDoc);
				}
				if (httpServletRequest.getParameterMap().containsKey("arcNDoc")) {
					arcNDoc = httpServletRequest.getParameter("arcNDoc");
					arcNDoc = UtilFormat.getValChars(arcNDoc);
				}
				if (httpServletRequest.getParameterMap().containsKey("arcDato1")) {
					arcDato1 = httpServletRequest.getParameter("arcDato1");
					arcDato1 = UtilFormat.getValChars(arcDato1);
				}
				if (httpServletRequest.getParameterMap().containsKey("arcDato2")) {
					arcDato2 = httpServletRequest.getParameter("arcDato2");
					arcDato2 = UtilFormat.getValChars(arcDato2);
				}
				if (httpServletRequest.getParameterMap().containsKey("arcDato3")) {
					arcDato3 = httpServletRequest.getParameter("arcDato3");
					arcDato3 = UtilFormat.getValChars(arcDato3);
				}
				if (httpServletRequest.getParameterMap().containsKey("arcDato4")) {
					arcDato4 = httpServletRequest.getParameter("arcDato4");
					arcDato4 = UtilFormat.getValChars(arcDato4);
				}
				if (httpServletRequest.getParameterMap().containsKey("arcObserv")) {
					arcObserv = httpServletRequest.getParameter("arcObserv");
					arcObserv = UtilFormat.getValChars(arcObserv);
				}
				if (httpServletRequest.getParameterMap().containsKey("operacion")) {
					operacion = httpServletRequest.getParameter("operacion");
					operacion = UtilFormat.getValChars(operacion);
				}
				if (httpServletRequest.getParameterMap().containsKey("arcDesc")) {
					arcDesc = httpServletRequest.getParameter("arcDesc");
					arcDesc = UtilFormat.getValChars(arcDesc);
				}
				if (httpServletRequest.getParameterMap().containsKey("arcIde")) {
					arcIde = httpServletRequest.getParameter("arcIde");
					arcIde = UtilFormat.getValChars(arcIde);
				}
				if (proceso.equalsIgnoreCase("SOL")) {
					// Solicitudes
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
							request.put("COD_TDO", tipoDoc);
							request.put("TIP_ARC", tipoArchivo);
							request.put("COD_USU", au.getPeopleSoft());
							request.put("APE_USU", au.getlName());
							request.put("NOM_USU", au.getfName());
							request.put("ARC_TDO", arcTDoc);
							request.put("ARC_NDO", arcNDoc);
							request.put("ARC_DA1", arcDato1);
							request.put("ARC_DA2", arcDato2);
							request.put("ARC_DA3", arcDato3);
							request.put("ARC_DA4", arcDato4);
							request.put("OBS_ARC", arcObserv);
							request.put("CON_ARC", contenido);
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
				} else if (proceso.equalsIgnoreCase("SIN")) {
					// Siniestros
					// Validacion de permisos
					if (au != null) {
						JSONObject request = new JSONObject();
						request.put("NRO_OPE", operacion);
						request.put("TIP_ARC", tipoArchivo);
						request.put("DES_ARC", arcDesc);
						request.put("IDE_ARC", arcIde);
						request.put("COD_USU", au.getPeopleSoft());
						request.put("APE_USU", au.getlName());
						request.put("NOM_USU", au.getfName());
						request.put("OBS_ARC", arcObserv);
						request.put("CON_ARC", contenido);
						String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP,
								MdwEnum.SP_FR_OPE_ARCXSIN_INS, request.toString());
						JSONObject jsonObject = new JSONObject(response);
						if (!jsonObject.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
							ret = FRConstants.FR_SER_UPE;
						} else {
							ret = FRConstants.FR_SER_NER;
						}
					} else {
						ret = FRConstants.FR_SER_UNF;
					}
				} else if (proceso.equalsIgnoreCase("DBE")) {
					// Designacion de Beneficiarios
					// Validacion de permisos
					if (au != null) {
						JSONObject request = new JSONObject();
						request.put("NRO_OPE", operacion);
						request.put("TIP_ARC", tipoArchivo);
						request.put("DES_ARC", arcDesc);
						request.put("IDE_ARC", arcIde);
						request.put("COD_USU", au.getPeopleSoft());
						request.put("APE_USU", au.getlName());
						request.put("NOM_USU", au.getfName());
						request.put("OBS_ARC", arcObserv);
						request.put("CON_ARC", contenido);
						String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP,
								MdwEnum.SP_FR_OPE_ARCXBEN_INS, request.toString());
						JSONObject jsonObject = new JSONObject(response);
						if (!jsonObject.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
							ret = FRConstants.FR_SER_UPE;
						} else {
							ret = FRConstants.FR_SER_NER;
						}
					} else {
						ret = FRConstants.FR_SER_UNF;
					}
				} else if (proceso.equalsIgnoreCase("RCO")) {
					// Adhesion Web
					// Validacion de permisos
					if (au != null) {
						JSONObject request = new JSONObject();
						request.put("COD_PRO", producto);
						request.put("NRO_OPE", operacion);
						request.put("TIP_ARC", tipoArchivo);
						request.put("DES_ARC", arcDesc);
						request.put("IDE_ARC", arcIde);
						request.put("COD_USU", au.getPeopleSoft());
						request.put("APE_USU", au.getlName());
						request.put("NOM_USU", au.getfName());
						request.put("OBS_ARC", arcObserv);
						request.put("CON_ARC", contenido);
						String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP,
								MdwEnum.SP_FR_OPE_ARCXRCO_INS, request.toString());
						JSONObject jsonObject = new JSONObject(response);
						if (!jsonObject.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
							ret = FRConstants.FR_SER_UPE;
						} else {
							ret = FRConstants.FR_SER_NER;
						}
					} else {
						ret = FRConstants.FR_SER_UNF;
					}
				}
			} else {
				ret = FRConstants.FR_SER_FSE;
			}
		} catch (Exception e) {
			ControllerPubServiceImpl.logger.error(e);
			ret = FRConstants.FR_SER_UPE;
		}
		// Armar respuesta
		OutputStream responseOutputStream = null;
		httpServletResponse.setContentType("text/html");
		responseOutputStream = httpServletResponse.getOutputStream();
		ret = "{\"Code\":\"" + ret + "\"}";
		responseOutputStream.write(ret.getBytes());
		responseOutputStream.flush();
		responseOutputStream.close();
		// Return
		return new ModelAndView("publishSvc");
	}

	private static byte[] getBytes(final InputStream is) throws IOException {
		int len;
		int size = 1024;
		byte[] buf;

		if (is instanceof ByteArrayInputStream) {
			size = is.available();
			buf = new byte[size];
			len = is.read(buf, 0, size);
		} else {
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			buf = new byte[size];
			while ((len = is.read(buf, 0, size)) != -1) {
				bos.write(buf, 0, len);
			}
			buf = bos.toByteArray();
		}
		return buf;
	}
}
