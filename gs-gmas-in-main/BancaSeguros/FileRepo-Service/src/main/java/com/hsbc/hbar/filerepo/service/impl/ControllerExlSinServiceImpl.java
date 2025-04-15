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

public class ControllerExlSinServiceImpl implements Controller {
	static Logger logger = LogManager.getLogger(ControllerExlSinServiceImpl.class);

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
			String denuTipDoc = "";
			String denuNroDoc = "";
			String denuApellido = "";
			String denuNombre = "";
			String ideArch = "";
			// Validacion
			if (httpServletRequest.getParameterMap().containsKey("tipoExl")) {
				tipoExl = httpServletRequest.getParameter("tipoExl");
			}
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
			if (httpServletRequest.getParameterMap().containsKey("denuTipDoc")) {
				denuTipDoc = httpServletRequest.getParameter("denuTipDoc");
				denuTipDoc = UtilFormat.getValChars(denuTipDoc);
			}
			if (httpServletRequest.getParameterMap().containsKey("denuNroDoc")) {
				denuNroDoc = httpServletRequest.getParameter("denuNroDoc");
				denuNroDoc = UtilFormat.getValChars(denuNroDoc);
			}
			if (httpServletRequest.getParameterMap().containsKey("denuApellido")) {
				denuApellido = httpServletRequest.getParameter("denuApellido");
				denuApellido = UtilFormat.getValChars(denuApellido);
			}
			if (httpServletRequest.getParameterMap().containsKey("denuNombre")) {
				denuNombre = httpServletRequest.getParameter("denuNombre");
				denuNombre = UtilFormat.getValChars(denuNombre);
			}
			if (httpServletRequest.getParameterMap().containsKey("ideArch")) {
				ideArch = httpServletRequest.getParameter("ideArch");
				ideArch = UtilFormat.getValChars(ideArch);
			}
			// Tipo de Excel
			if (tipoExl.equalsIgnoreCase("S")) {
				// Solicitud
				// Servicio
				try {
					JSONObject request = new JSONObject();
					request.put("NRO_OPE", operacion);
					request.put("COD_PRO", producto);
					request.put("NRO_POL", poliza);
					request.put("COD_EST", estado);
					request.put("FIN_DES", fechaIngDesde);
					request.put("FIN_HAS", fechaIngHasta);
					request.put("FMA_DES", fechaManDesde);
					request.put("FMA_HAS", fechaManHasta);
					request.put("ASE_TDO", asegTipDoc);
					request.put("ASE_NDO", asegNroDoc);
					request.put("ASE_APE", asegApellido);
					request.put("ASE_NOM", asegNombre);
					request.put("TOM_TDO", tomaTipDoc);
					request.put("TOM_NDO", tomaNroDoc);
					request.put("TOM_APE", tomaApellido);
					request.put("TOM_NOM", tomaNombre);
					request.put("DEN_TDO", denuTipDoc);
					request.put("DEN_NDO", denuNroDoc);
					request.put("DEN_APE", denuApellido);
					request.put("DEN_NOM", denuNombre);
					String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SINIESTRO_FIL,
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
			} else if (tipoExl.equalsIgnoreCase("A")) {
				// Archivos Agregados
				// Servicio
				try {
					JSONObject request = new JSONObject();
					request.put("NRO_OPE", operacion);
					request.put("IDE_ARC", ideArch);
					request.put("FIN_DES", fechaIngDesde);
					request.put("FIN_HAS", fechaIngHasta);
					String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCXSIN_FIL,
							request.toString());
					// Armado Excel
					StringBuilder sbExl = null;
					JSONObject responseSvc = new JSONObject(response);
					if (!responseSvc.has("Code") || !responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
						sRet = FRConstants.FR_SER_EXE;
					} else {
						if (responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
								.getJSONArray(MsgConstants.MC_REG).length() > 0) {
							sbExl = setExlFileAddBufferSOL(responseSvc.getJSONObject(MsgConstants.MC_MSG)
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
		writer.append("NRO_OPE");
		writer.append(';');
		writer.append("COD_PRO");
		writer.append(';');
		writer.append("COD_EST");
		writer.append(';');
		writer.append("DES_EST");
		writer.append(';');
		writer.append("FEC_ING");
		writer.append(';');
		writer.append("ASE_TDD");
		writer.append(';');
		writer.append("ASE_NDO");
		writer.append(';');
		writer.append("ASE_APE");
		writer.append(';');
		writer.append("ASE_NOM");
		writer.append(';');
		writer.append("TOM_TDD");
		writer.append(';');
		writer.append("TOM_NDO");
		writer.append(';');
		writer.append("TOM_APE");
		writer.append(';');
		writer.append("TOM_NOM");
		writer.append(';');
		writer.append("DEN_TDD");
		writer.append(';');
		writer.append("DEN_NDO");
		writer.append(';');
		writer.append("DEN_APE");
		writer.append(';');
		writer.append("DEN_NOM");
		writer.append(';');
		writer.append("UMA_FEC");
		writer.append(';');
		writer.append("UMA_COD");
		writer.append(';');
		writer.append("UMA_APE");
		writer.append(';');
		writer.append("UMA_NOM");
		writer.append(';');
		writer.append("NRO_POL");
		writer.append(';');
		writer.append("OBS_OPE");
		writer.append(';');
		writer.append('\n');
		// Datos
		for (int i = 0; i < jarrSoli.length(); i++) {
			JSONObject jobjSoli = jarrSoli.getJSONObject(i);
			writer.append(jobjSoli.getLong("NRO_OPE"));
			writer.append(';');
			writer.append(jobjSoli.getString("COD_PRO"));
			writer.append(';');
			writer.append(jobjSoli.getInt("COD_EST"));
			writer.append(';');
			writer.append(jobjSoli.getString("DES_EST"));
			writer.append(';');
			if (jobjSoli.getString("FEC_ING").length() > 10) {
				writer.append(jobjSoli.getString("FEC_ING").substring(0, 10));
			} else {
				writer.append(jobjSoli.getString("FEC_ING"));
			}
			writer.append(';');
			writer.append(jobjSoli.getString("ASE_TDD"));
			writer.append(';');
			writer.append(jobjSoli.getString("ASE_NDO"));
			writer.append(';');
			writer.append(jobjSoli.getString("ASE_APE"));
			writer.append(';');
			writer.append(jobjSoli.getString("ASE_NOM"));
			writer.append(';');
			writer.append(jobjSoli.getString("TOM_TDD"));
			writer.append(';');
			writer.append(jobjSoli.getString("TOM_NDO"));
			writer.append(';');
			writer.append(jobjSoli.getString("TOM_APE"));
			writer.append(';');
			writer.append(jobjSoli.getString("TOM_NOM"));
			writer.append(';');
			writer.append(jobjSoli.getString("DEN_TDD"));
			writer.append(';');
			writer.append(jobjSoli.getString("DEN_NDO"));
			writer.append(';');
			writer.append(jobjSoli.getString("DEN_APE"));
			writer.append(';');
			writer.append(jobjSoli.getString("DEN_NOM"));
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
			writer.append(jobjSoli.getString("NRO_POL"));
			writer.append(';');
			writer.append(jobjSoli.getString("OBS_OPE"));
			writer.append(';');
			writer.append('\n');
		}
		return writer;
	}

	private static StringBuilder setExlFileAddBufferSOL(final JSONArray jarrSoli) {
		StringBuilder writer = new StringBuilder();
		// Titulos
		writer.append("OPERACION");
		writer.append(';');
		writer.append("DESCRIPCION");
		writer.append(';');
		writer.append("FECHA");
		writer.append(';');
		writer.append('\n');
		// Datos
		for (int i = 0; i < jarrSoli.length(); i++) {
			JSONObject jobjSoli = jarrSoli.getJSONObject(i);
			writer.append(jobjSoli.getLong("NRO_OPE"));
			writer.append(';');
			writer.append(jobjSoli.getString("DES_ARC"));
			writer.append(';');
			if (jobjSoli.getString("UIN_FEC").length() > 10) {
				writer.append(jobjSoli.getString("UIN_FEC").substring(0, 10));
			} else {
				writer.append(jobjSoli.getString("UIN_FEC"));
			}
			writer.append(';');
			writer.append('\n');
		}
		return writer;
	}
}
