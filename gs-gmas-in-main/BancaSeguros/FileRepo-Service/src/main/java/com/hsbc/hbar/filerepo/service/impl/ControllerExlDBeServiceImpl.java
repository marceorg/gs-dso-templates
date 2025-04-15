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

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import com.hsbc.hbar.filerepo.model.common.AuthorizedUser;
import com.hsbc.hbar.filerepo.model.constant.FRConstants;
import com.hsbc.hbar.filerepo.model.constant.MsgConstants;
import com.hsbc.hbar.filerepo.model.enums.DestinationEnum;
import com.hsbc.hbar.filerepo.model.enums.MdwEnum;
import com.hsbc.hbar.filerepo.service.MdwService;
import com.hsbc.hbar.filerepo.service.utils.UtilFormat;

public class ControllerExlDBeServiceImpl implements Controller {
	static Logger logger = LogManager.getLogger(ControllerExlDBeServiceImpl.class);

	private MdwService mdwService;

	public MdwService getMdwService() {
		if (this.mdwService == null) {
			this.mdwService = (MdwService) ServiceFactory.getContext().getBean("MdwService");
		}
		return this.mdwService;
	}

	public void setMdwService(final MdwService mdwService) {
		this.mdwService = mdwService;
	}

	public ModelAndView handleRequest(final HttpServletRequest httpServletRequest,
			final HttpServletResponse httpServletResponse) throws ServletException, IOException {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		String sRet = "";
		if (au != null) {
			// Parametros
			String operacion = "";
			String producto = "";
			String poliza = "";
			String estado = "";
			String fechaIngDesde = "";
			String fechaIngHasta = "";
			String fechaManDesde = "";
			String fechaManHasta = "";
			String asegTipDoc = "";
			String asegNroDoc = "";
			String asegApellido = "";
			String asegNombre = "";
			String tomaTipDoc = "";
			String tomaNroDoc = "";
			String tomaApellido = "";
			String tomaNombre = "";
			// Validacion
			if (httpServletRequest.getParameterMap().containsKey("operacion")) {
				operacion = httpServletRequest.getParameter("operacion");
				operacion = UtilFormat.getValChars(operacion);
			}
			if (httpServletRequest.getParameterMap().containsKey("producto")) {
				producto = httpServletRequest.getParameter("producto");
				producto = UtilFormat.getValChars(producto);
			}
			if (httpServletRequest.getParameterMap().containsKey("poliza")) {
				poliza = httpServletRequest.getParameter("poliza");
				poliza = UtilFormat.getValChars(poliza);
			}
			if (httpServletRequest.getParameterMap().containsKey("estado")) {
				estado = httpServletRequest.getParameter("estado");
				estado = UtilFormat.getValChars(estado);
			}
			if (httpServletRequest.getParameterMap().containsKey("fechaIngDesde")) {
				fechaIngDesde = httpServletRequest.getParameter("fechaIngDesde");
				fechaIngDesde = UtilFormat.getValChars(fechaIngDesde);
			}
			if (httpServletRequest.getParameterMap().containsKey("fechaIngHasta")) {
				fechaIngHasta = httpServletRequest.getParameter("fechaIngHasta");
				fechaIngHasta = UtilFormat.getValChars(fechaIngHasta);
			}
			if (httpServletRequest.getParameterMap().containsKey("fechaManDesde")) {
				fechaManDesde = httpServletRequest.getParameter("fechaManDesde");
				fechaManDesde = UtilFormat.getValChars(fechaManDesde);
			}
			if (httpServletRequest.getParameterMap().containsKey("fechaManHasta")) {
				fechaManHasta = httpServletRequest.getParameter("fechaManHasta");
				fechaManHasta = UtilFormat.getValChars(fechaManHasta);
			}
			if (httpServletRequest.getParameterMap().containsKey("asegTipDoc")) {
				asegTipDoc = httpServletRequest.getParameter("asegTipDoc");
				asegTipDoc = UtilFormat.getValChars(asegTipDoc);
			}
			if (httpServletRequest.getParameterMap().containsKey("asegNroDoc")) {
				asegNroDoc = httpServletRequest.getParameter("asegNroDoc");
				asegNroDoc = UtilFormat.getValChars(asegNroDoc);
			}
			if (httpServletRequest.getParameterMap().containsKey("asegApellido")) {
				asegApellido = httpServletRequest.getParameter("asegApellido");
				asegApellido = UtilFormat.getValChars(asegApellido);
			}
			if (httpServletRequest.getParameterMap().containsKey("asegNombre")) {
				asegNombre = httpServletRequest.getParameter("asegNombre");
				asegNombre = UtilFormat.getValChars(asegNombre);
			}
			if (httpServletRequest.getParameterMap().containsKey("tomaTipDoc")) {
				tomaTipDoc = httpServletRequest.getParameter("tomaTipDoc");
				tomaTipDoc = UtilFormat.getValChars(tomaTipDoc);
			}
			if (httpServletRequest.getParameterMap().containsKey("tomaNroDoc")) {
				tomaNroDoc = httpServletRequest.getParameter("tomaNroDoc");
				tomaNroDoc = UtilFormat.getValChars(tomaNroDoc);
			}
			if (httpServletRequest.getParameterMap().containsKey("tomaApellido")) {
				tomaApellido = httpServletRequest.getParameter("tomaApellido");
				tomaApellido = UtilFormat.getValChars(tomaApellido);
			}
			if (httpServletRequest.getParameterMap().containsKey("tomaNombre")) {
				tomaNombre = httpServletRequest.getParameter("tomaNombre");
				tomaNombre = UtilFormat.getValChars(tomaNombre);
			}
			// Solicitud
			// Servicio
			try {
				JSONObject request = new JSONObject();
				request.put(MsgConstants.MC_NRO_OPE, operacion);
				request.put(MsgConstants.MC_COD_PRO, producto);
				request.put(MsgConstants.MC_NRO_POL, poliza);
				request.put(MsgConstants.MC_COD_EST, estado);
				request.put(MsgConstants.MC_FIN_DES, fechaIngDesde);
				request.put(MsgConstants.MC_FIN_HAS, fechaIngHasta);
				request.put(MsgConstants.MC_FMA_DES, fechaManDesde);
				request.put(MsgConstants.MC_FMA_HAS, fechaManHasta);
				request.put(MsgConstants.MC_ASE_TDO, asegTipDoc);
				request.put(MsgConstants.MC_ASE_NDO, asegNroDoc);
				request.put(MsgConstants.MC_ASE_APE, asegApellido);
				request.put(MsgConstants.MC_ASE_NOM, asegNombre);
				request.put(MsgConstants.MC_TOM_TDO, tomaTipDoc);
				request.put(MsgConstants.MC_TOM_NDO, tomaNroDoc);
				request.put(MsgConstants.MC_TOM_APE, tomaApellido);
				request.put(MsgConstants.MC_TOM_NOM, tomaNombre);
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_BENEFIC_FIL,
						request.toString());
				// Armado Excel
				StringBuilder sbExl = null;
				JSONObject responseSvc = new JSONObject(response);
				if (!responseSvc.has("Code") || !responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
					sRet = FRConstants.FR_SER_EXE;
				} else {
					if (responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
							.getJSONArray(MsgConstants.MC_REG).length() > 0) {
						sbExl = setExlFileBufferSOL(responseSvc.getJSONObject(MsgConstants.MC_MSG)
								.getJSONObject(MsgConstants.MC_RGS).getJSONArray(MsgConstants.MC_REG));
						sRet = sbExl.toString();
					} else {
						sRet = FRConstants.FR_SER_NER;
					}
				}
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				sRet = FRConstants.FR_SER_EXE;
			}
		} else {
			sRet = FRConstants.FR_SER_UNF;
		}
		// Armar vuelta
		OutputStream responseOutputStream = null;
		httpServletResponse.setContentType(FRConstants.TA_APP_OST);
		httpServletResponse.setHeader("Content-Disposition", "attachment;filename=dwlExcel.csv");
		responseOutputStream = httpServletResponse.getOutputStream();
		responseOutputStream.write(sRet.getBytes());
		responseOutputStream.flush();
		responseOutputStream.close();
		// Return
		return new ModelAndView("dwlExcelSvc");
	}

	private static StringBuilder setExlFileBufferSOL(final JSONArray jarrSoli) {
		StringBuilder writer = new StringBuilder();
		// Titulos
		writer.append(MsgConstants.MC_NRO_OPE);
		writer.append(';');
		writer.append(MsgConstants.MC_COD_PRO);
		writer.append(';');
		writer.append(MsgConstants.MC_COD_EST);
		writer.append(';');
		writer.append(MsgConstants.MC_DES_EST);
		writer.append(';');
		writer.append(MsgConstants.MC_FEC_ING);
		writer.append(';');
		writer.append(MsgConstants.MC_ASE_TDD);
		writer.append(';');
		writer.append(MsgConstants.MC_ASE_NDO);
		writer.append(';');
		writer.append(MsgConstants.MC_ASE_APE);
		writer.append(';');
		writer.append(MsgConstants.MC_ASE_NOM);
		writer.append(';');
		writer.append(MsgConstants.MC_TOM_TDD);
		writer.append(';');
		writer.append(MsgConstants.MC_TOM_NDO);
		writer.append(';');
		writer.append(MsgConstants.MC_TOM_APE);
		writer.append(';');
		writer.append(MsgConstants.MC_TOM_NOM);
		writer.append(';');
		writer.append(MsgConstants.MC_UMA_FEC);
		writer.append(';');
		writer.append(MsgConstants.MC_UMA_COD);
		writer.append(';');
		writer.append(MsgConstants.MC_UMA_APE);
		writer.append(';');
		writer.append(MsgConstants.MC_UMA_NOM);
		writer.append(';');
		writer.append(MsgConstants.MC_NRO_POL);
		writer.append(';');
		writer.append(MsgConstants.MC_OBS_OPE);
		writer.append(';');
		writer.append('\n');
		// Datos
		for (int i = 0; i < jarrSoli.length(); i++) {
			JSONObject jobjSoli = jarrSoli.getJSONObject(i);
			writer.append(jobjSoli.getLong(MsgConstants.MC_NRO_OPE));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_COD_PRO));
			writer.append(';');
			writer.append(jobjSoli.getInt(MsgConstants.MC_COD_EST));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_DES_EST));
			writer.append(';');
			if (jobjSoli.getString(MsgConstants.MC_FEC_ING).length() > 10) {
				writer.append(jobjSoli.getString(MsgConstants.MC_FEC_ING).substring(0, 10));
			} else {
				writer.append(jobjSoli.getString(MsgConstants.MC_FEC_ING));
			}
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_ASE_TDD));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_ASE_NDO));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_ASE_APE));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_ASE_NOM));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_TOM_TDD));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_TOM_NDO));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_TOM_APE));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_TOM_NOM));
			writer.append(';');
			if (jobjSoli.getString(MsgConstants.MC_UMA_FEC).length() > 10) {
				writer.append(jobjSoli.getString(MsgConstants.MC_UMA_FEC).substring(0, 10));
			} else {
				writer.append(jobjSoli.getString(MsgConstants.MC_UMA_FEC));
			}
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_UMA_COD));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_UMA_APE));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_UMA_NOM));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_NRO_POL));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_OBS_OPE));
			writer.append(';');
			writer.append('\n');
		}
		return writer;
	}
}
