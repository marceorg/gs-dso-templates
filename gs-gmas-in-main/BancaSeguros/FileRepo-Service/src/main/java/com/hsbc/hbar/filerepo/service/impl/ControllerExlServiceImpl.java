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

public class ControllerExlServiceImpl implements Controller {
	static Logger logger = LogManager.getLogger(ControllerExlServiceImpl.class);

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
			String tipoExl = "";
			String producto = "";
			String solicitud = "";
			String propuesta = "";
			String fase = "";
			String estado = "";
			String otro = "";
			String oficina = "";
			String asesor = "";
			String fechaIngDesde = "";
			String fechaIngHasta = "";
			String fechaManDesde = "";
			String fechaManHasta = "";
			String asegTipDoc = "";
			String asegNroDoc = "";
			String asegApellido = "";
			String asegNombre = "";
			// Validacion
			if (httpServletRequest.getParameterMap().containsKey("tipoExl")) {
				tipoExl = httpServletRequest.getParameter("tipoExl");
			}
			if (httpServletRequest.getParameterMap().containsKey("producto")) {
				producto = httpServletRequest.getParameter("producto");
				producto = UtilFormat.getValChars(producto);
			}
			if (httpServletRequest.getParameterMap().containsKey("solicitud")) {
				solicitud = httpServletRequest.getParameter("solicitud");
				solicitud = UtilFormat.getValChars(solicitud);
			}
			if (httpServletRequest.getParameterMap().containsKey("propuesta")) {
				propuesta = httpServletRequest.getParameter("propuesta");
				propuesta = UtilFormat.getValChars(propuesta);
			}
			if (httpServletRequest.getParameterMap().containsKey("fase")) {
				fase = httpServletRequest.getParameter("fase");
				fase = UtilFormat.getValChars(fase);
			}
			if (httpServletRequest.getParameterMap().containsKey("estado")) {
				estado = httpServletRequest.getParameter("estado");
				estado = UtilFormat.getValChars(estado);
			}
			if (httpServletRequest.getParameterMap().containsKey("otro")) {
				otro = httpServletRequest.getParameter("otro");
				otro = UtilFormat.getValChars(otro);
			}
			if (httpServletRequest.getParameterMap().containsKey("oficina")) {
				oficina = httpServletRequest.getParameter("oficina");
				oficina = UtilFormat.getValChars(oficina);
			}
			if (httpServletRequest.getParameterMap().containsKey("asesor")) {
				asesor = httpServletRequest.getParameter("asesor");
				asesor = UtilFormat.getValChars(asesor);
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
			// Tipo de Excel
			if (tipoExl.equalsIgnoreCase("S")) {
				// Solicitud
				// Servicio
				try {
					JSONObject request = new JSONObject();
					request.put("COD_PRO", producto);
					request.put("NRO_SOL", solicitud);
					request.put("NRO_PRO", propuesta);
					request.put("COD_FAS", fase);
					request.put("COD_EST", estado);
					request.put("COD_OTR", otro);
					request.put("COD_OFI", oficina);
					request.put("VEN_COD", asesor);
					request.put("FIN_DES", fechaIngDesde);
					request.put("FIN_HAS", fechaIngHasta);
					request.put("FMA_DES", fechaManDesde);
					request.put("FMA_HAS", fechaManHasta);
					request.put("ASE_TDO", asegTipDoc);
					request.put("ASE_NDO", asegNroDoc);
					request.put("ASE_APE", asegApellido);
					request.put("ASE_NOM", asegNombre);
					String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SOLICITUD_FIL,
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
		writer.append("COD_PRO");
		writer.append(';');
		writer.append("NRO_SOL");
		writer.append(';');
		writer.append("COD_EST");
		writer.append(';');
		writer.append("DES_EST");
		writer.append(';');
		writer.append("COD_OTR");
		writer.append(';');
		writer.append("DES_OTR");
		writer.append(';');
		writer.append("COD_FAS");
		writer.append(';');
		writer.append("DES_FAS");
		writer.append(';');
		writer.append("FEC_ING");
		writer.append(';');
		writer.append("ASE_TDO");
		writer.append(';');
		writer.append("ASE_TDD");
		writer.append(';');
		writer.append("ASE_NDO");
		writer.append(';');
		writer.append("ASE_APE");
		writer.append(';');
		writer.append("ASE_NOM");
		writer.append(';');
		writer.append("COT_SUM");
		writer.append(';');
		writer.append("COT_PRI");
		writer.append(';');
		writer.append("COT_PLU");
		writer.append(';');
		writer.append("COD_OFI");
		writer.append(';');
		writer.append("TIP_SOL");
		writer.append(';');
		writer.append("VEN_COD");
		writer.append(';');
		writer.append("VEN_APE");
		writer.append(';');
		writer.append("VEN_NOM");
		writer.append(';');
		writer.append("UMA_FEC");
		writer.append(';');
		writer.append("UMA_COD");
		writer.append(';');
		writer.append("UMA_APE");
		writer.append(';');
		writer.append("UMA_NOM");
		writer.append(';');
		writer.append("UTO_FEC");
		writer.append(';');
		writer.append("UTO_COD");
		writer.append(';');
		writer.append("UTO_APE");
		writer.append(';');
		writer.append("UTO_NOM");
		writer.append(';');
		writer.append("NRO_PRO");
		writer.append(';');
		writer.append("NRO_POL");
		writer.append(';');
		writer.append("OBS_SOL");
		writer.append(';');
		writer.append('\n');
		// Datos
		for (int i = 0; i < jarrSoli.length(); i++) {
			JSONObject jobjSoli = jarrSoli.getJSONObject(i);
			writer.append(jobjSoli.getString("COD_PRO"));
			writer.append(';');
			writer.append(jobjSoli.getLong("NRO_SOL"));
			writer.append(';');
			writer.append(jobjSoli.getInt("COD_EST"));
			writer.append(';');
			writer.append(jobjSoli.getString("DES_EST"));
			writer.append(';');
			writer.append(jobjSoli.getInt("COD_OTR"));
			writer.append(';');
			writer.append(jobjSoli.getString("DES_OTR"));
			writer.append(';');
			writer.append(jobjSoli.getInt("COD_FAS"));
			writer.append(';');
			writer.append(jobjSoli.getString("DES_FAS"));
			writer.append(';');
			if (jobjSoli.getString("FEC_ING").length() > 10) {
				writer.append(jobjSoli.getString("FEC_ING").substring(0, 10));
			} else {
				writer.append(jobjSoli.getString("FEC_ING"));
			}
			writer.append(';');
			writer.append(jobjSoli.getInt("ASE_TDO"));
			writer.append(';');
			writer.append(jobjSoli.getString("ASE_TDD"));
			writer.append(';');
			writer.append(jobjSoli.getString("ASE_NDO"));
			writer.append(';');
			writer.append(jobjSoli.getString("ASE_APE"));
			writer.append(';');
			writer.append(jobjSoli.getString("ASE_NOM"));
			writer.append(';');
			writer.append(jobjSoli.getString("COT_SUM"));
			writer.append(';');
			writer.append(jobjSoli.getString("COT_PRI"));
			writer.append(';');
			writer.append(jobjSoli.getString("COT_PLU"));
			writer.append(';');
			writer.append(jobjSoli.getString("COD_OFI"));
			writer.append(';');
			if (jobjSoli.getString("TIP_SOL").equalsIgnoreCase("N")) {
				writer.append("ONLINE");
			} else if (jobjSoli.getString("TIP_SOL").equalsIgnoreCase("F")) {
				writer.append("OFFLINE");
			} else {
				writer.append("NO ASIG.");
			}
			writer.append(';');
			writer.append(jobjSoli.getString("VEN_COD"));
			writer.append(';');
			writer.append(jobjSoli.getString("VEN_APE"));
			writer.append(';');
			writer.append(jobjSoli.getString("VEN_NOM"));
			writer.append(';');
			if (jobjSoli.getString("UMA_FEC").length() > 10) {
				writer.append(jobjSoli.getString("UMA_FEC").substring(0, 10));
			} else {
				writer.append(jobjSoli.getString("UMA_FEC"));
			}
			writer.append(';');
			writer.append(jobjSoli.getString("UMA_COD"));
			writer.append(';');
			writer.append(jobjSoli.getString("UMA_APE"));
			writer.append(';');
			writer.append(jobjSoli.getString("UMA_NOM"));
			writer.append(';');
			if (jobjSoli.getString("UTO_FEC").length() > 10) {
				writer.append(jobjSoli.getString("UTO_FEC").substring(0, 10));
			} else {
				writer.append(jobjSoli.getString("UTO_FEC"));
			}
			writer.append(';');
			writer.append(jobjSoli.getString("UTO_COD"));
			writer.append(';');
			writer.append(jobjSoli.getString("UTO_APE"));
			writer.append(';');
			writer.append(jobjSoli.getString("UTO_NOM"));
			writer.append(';');
			writer.append(jobjSoli.getString("NRO_PRO"));
			writer.append(';');
			writer.append(jobjSoli.getString("NRO_POL"));
			writer.append(';');
			writer.append(jobjSoli.getString("OBS_SOL"));
			writer.append(';');
			writer.append('\n');
		}
		return writer;
	}
}
