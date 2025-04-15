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

public class ControllerExlRCoServiceImpl implements Controller {
	static Logger logger = LogManager.getLogger(ControllerExlRCoServiceImpl.class);

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
		String nomArch = "dwlExcel";
		if (au != null) {
			// Parametros
			String tipoExl = "";
			String producto = "";
			String operacion = "";
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
			String reqAdic = "";
			// Validacion
			if (httpServletRequest.getParameterMap().containsKey("tipoExl")) {
				tipoExl = httpServletRequest.getParameter("tipoExl");
			}
			if (httpServletRequest.getParameterMap().containsKey("producto")) {
				producto = httpServletRequest.getParameter("producto");
				producto = UtilFormat.getValChars(producto);
			}
			if (httpServletRequest.getParameterMap().containsKey("operacion")) {
				operacion = httpServletRequest.getParameter("operacion");
				operacion = UtilFormat.getValChars(operacion);
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
			if (httpServletRequest.getParameterMap().containsKey("reqAdic")) {
				reqAdic = httpServletRequest.getParameter("reqAdic");
				reqAdic = UtilFormat.getValChars(reqAdic);
			}
			// Tipo de Excel
			if (tipoExl.equalsIgnoreCase("S")) {
				// Solicitud
				// Servicio
				try {
					JSONObject request = new JSONObject();
					request.put(MsgConstants.MC_COD_PRO, producto);
					request.put(MsgConstants.MC_NRO_OPE, operacion);
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
					request.put(MsgConstants.MC_REQ_ADI, reqAdic);
					String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_RETCOL_FIL,
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
			} else if (tipoExl.equalsIgnoreCase("R")) {
				// Reporte del Tomador
				// Servicio
				try {
					// Solo si es Vida Colectivo
					String tipoProdu = getTipoProduVC(producto);
					if (!tipoProdu.equalsIgnoreCase("")) {
						nomArch = "ReporteTom" + producto;
						// Obtener operaciones
						JSONObject request = new JSONObject();
						request.put(MsgConstants.MC_COD_PRO, producto);
						request.put(MsgConstants.MC_NRO_OPE, operacion);
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
						request.put(MsgConstants.MC_REQ_ADI, reqAdic);
						String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP,
								MdwEnum.SP_FR_OPE_RETCOL_FIL, request.toString());
						// Armado Excel
						StringBuilder sbExl = null;
						JSONObject responseSvc = new JSONObject(response);
						if (!responseSvc.has("Code")
								|| !responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
							sRet = FRConstants.FR_SER_EXE;
						} else {
							if (responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
									.getJSONArray(MsgConstants.MC_REG).length() > 0) {
								sbExl = setExlFileBufferRdT(tipoProdu, responseSvc.getJSONObject(MsgConstants.MC_MSG)
										.getJSONObject(MsgConstants.MC_RGS).getJSONArray(MsgConstants.MC_REG));
								sRet = sbExl.toString();
							} else {
								sRet = FRConstants.FR_SER_NER;
							}
						}
					} else {
						sRet = FRConstants.FR_SER_EXE;
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
		httpServletResponse.setHeader("Content-Disposition", "attachment;filename=" + nomArch + ".csv");
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
		writer.append(MsgConstants.MC_COD_PRO);
		writer.append(';');
		writer.append(MsgConstants.MC_NRO_POL);
		writer.append(';');
		writer.append(MsgConstants.MC_NRO_OPE);
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
		writer.append("R_DDJJS");
		writer.append(';');
		writer.append("R_MEDIC");
		writer.append(';');
		writer.append(MsgConstants.MC_UMA_FEC);
		writer.append(';');
		writer.append(MsgConstants.MC_UMA_COD);
		writer.append(';');
		writer.append(MsgConstants.MC_UMA_APE);
		writer.append(';');
		writer.append(MsgConstants.MC_UMA_NOM);
		writer.append(';');
		writer.append(MsgConstants.MC_OBS_OPE);
		writer.append(';');
		writer.append('\n');
		// Datos
		for (int i = 0; i < jarrSoli.length(); i++) {
			JSONObject jobjSoli = jarrSoli.getJSONObject(i);
			writer.append(jobjSoli.getString(MsgConstants.MC_COD_PRO));
			writer.append(';');
			writer.append(jobjSoli.getString(MsgConstants.MC_NRO_POL));
			writer.append(';');
			writer.append(jobjSoli.getLong(MsgConstants.MC_NRO_OPE));
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
			writer.append(!jobjSoli.getString(MsgConstants.MC_REQ_ADI).trim().equalsIgnoreCase("") ? "S" : "N");
			writer.append(';');
			writer.append(!jobjSoli.getString(MsgConstants.MC_REQ_ADI).trim().equalsIgnoreCase("3") ? "N" : "S");
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
			writer.append(jobjSoli.getString(MsgConstants.MC_OBS_OPE));
			writer.append(';');
			writer.append('\n');
		}
		return writer;
	}

	private String getTipoProduVC(final String producto) {
		String tipoProdu = "";
		JSONObject request = new JSONObject();
		request.put(MsgConstants.MC_COD_PRO, producto);
		String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.P_NBWS_PAR_TPRODVC_SEL,
				request.toString());
		JSONObject responseSvc = new JSONObject(response);
		if (responseSvc.has("Code")
				|| responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)
				&& responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
						.getJSONArray(MsgConstants.MC_REG).length() > 0) {
			tipoProdu = responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
					.getJSONArray(MsgConstants.MC_REG).getJSONObject(0).getString("TIP_PRO");
		}
		return tipoProdu;
	}

	private StringBuilder setExlFileBufferRdT(final String tipoProdu, final JSONArray jarrSoli) {
		// Reporte del tomador
		StringBuilder writer = new StringBuilder();
		// Titulos
		writer.append("Poliza");
		writer.append(';');
		writer.append("CUIT");
		writer.append(';');
		writer.append("Raz.Social");
		writer.append(';');
		writer.append("Fecha de solicitud");
		writer.append(';');
		writer.append("Nombre");
		writer.append(';');
		writer.append("Apellido");
		writer.append(';');
		writer.append("CUIL");
		writer.append(';');
		writer.append("Fec.Nac.");
		writer.append(';');
		writer.append("DDJJ");
		writer.append(';');
		writer.append("R.Medicos");
		writer.append(';');
		if (tipoProdu.equalsIgnoreCase("MS")) {
			writer.append("Multiplo elegido");
			writer.append(';');
		} else {
			writer.append("Suma Asegurada");
			writer.append(';');
		}
		if (tipoProdu.equalsIgnoreCase("SE")) {
			writer.append("Familiares S/N");
			writer.append(';');
			writer.append("Parentesco");
			writer.append(';');
			writer.append("Nombre");
			writer.append(';');
			writer.append("Apellido");
			writer.append(';');
			writer.append("Documento");
			writer.append(';');
			writer.append("Fec.Nac.");
			writer.append(';');
			writer.append('\n');
		} else {
			writer.append("Conyuge S/N");
			writer.append(';');
			writer.append("Nombre Conyuge");
			writer.append(';');
			writer.append("Apellido Conyuge");
			writer.append(';');
			writer.append("CUIL Conyuge");
			writer.append(';');
			writer.append("Fec.Nac. Conyuge");
			writer.append(';');
			writer.append('\n');
		}
		// Datos
		for (int i = 0; i < jarrSoli.length(); i++) {
			JSONObject jobjSoli = jarrSoli.getJSONObject(i);
			// Recuperar Solicitud
			JSONObject request = new JSONObject();
			request.put(MsgConstants.MC_COD_PRO, jobjSoli.getString(MsgConstants.MC_COD_PRO));
			request.put(MsgConstants.MC_NRO_OPE, jobjSoli.getInt(MsgConstants.MC_NRO_OPE));
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.OV_OPERACION_RET_SEL,
					request.toString());
			JSONObject responseSvc = new JSONObject(response);
			if (responseSvc.has("Code") || responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
				writer.append(jobjSoli.getString(MsgConstants.MC_COD_PRO));
				writer.append(' ');
				writer.append(jobjSoli.getString(MsgConstants.MC_NRO_POL));
				writer.append(';');
				writer.append(jobjSoli.getString(MsgConstants.MC_TOM_NDO));
				writer.append(';');
				writer.append(jobjSoli.getString(MsgConstants.MC_TOM_APE));
				writer.append(';');
				writer.append(jobjSoli.getString(MsgConstants.MC_FEC_ING).substring(0, 10));
				writer.append(';');
				writer.append(jobjSoli.getString(MsgConstants.MC_ASE_NOM));
				writer.append(';');
				writer.append(jobjSoli.getString(MsgConstants.MC_ASE_APE));
				writer.append(';');
				writer.append(jobjSoli.getString(MsgConstants.MC_ASE_NDO));
				writer.append(';');
				// Persona Solicitante
				JSONArray jarrPers = responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject("PERSONAS")
						.getJSONArray("PERSONA");
				Integer indPerSol = getPerIndex("S", jarrPers);
				writer.append(UtilFormat.setNumberToDate(jarrPers.getJSONObject(indPerSol).getInt(MsgConstants.MC_FEC_NAC)));
				writer.append(';');
				// Operacion
				JSONObject jsonOpe = responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
						.getJSONArray(MsgConstants.MC_REG).getJSONObject(0);
				// Requisitos Adic.
				if (jsonOpe.getString("TIP_TAS").trim().equalsIgnoreCase("")) {
					// Nada
					writer.append('N');
					writer.append(';');
					writer.append('N');
				} else if (jsonOpe.getString("TIP_TAS").trim().equalsIgnoreCase("3")) {
					// DDJJ y Req.Med.
					writer.append('S');
					writer.append(';');
					writer.append('S');
				} else {
					// DDJJ
					writer.append('S');
					writer.append(';');
					writer.append('N');
				}
				writer.append(';');
				if (tipoProdu.equalsIgnoreCase("MS")) {
					// Suma Asegurada
					writer.append(jsonOpe.getString("EMP_ROL"));
					writer.append(';');
				} else {
					// Cantidad Sueldos
					writer.append(jsonOpe.getString("EMP_NOM"));
					writer.append(';');
				}
				if (tipoProdu.equalsIgnoreCase("SE")) {
					// Familiares
					if (getSepTieneFam(jarrPers)) {
						writer.append("S");
						writer.append(';');
						for (int j = 0; j < jarrPers.length(); j++) {
							if (jarrPers.getJSONObject(j).getString(MsgConstants.MC_CLA_PER).equalsIgnoreCase("F")) {
								if (j > 0) {
									// Linea en blanco
									writer.append(';');
									writer.append(';');
									writer.append(';');
									writer.append(';');
									writer.append(';');
									writer.append(';');
									writer.append(';');
									writer.append(';');
									writer.append(';');
									writer.append(';');
									writer.append(';');
									writer.append(';');
								}
								writer.append(getSepParentesco(jarrPers.getJSONObject(j).getString("VAL_001")));
								writer.append(';');
								writer.append(jarrPers.getJSONObject(j).getString("NOM_PER"));
								writer.append(';');
								writer.append(jarrPers.getJSONObject(j).getString("APE_PER"));
								writer.append(';');
								writer.append(jarrPers.getJSONObject(j).getString("NRO_DOC"));
								writer.append(';');
								writer.append(UtilFormat.setNumberToDate(jarrPers.getJSONObject(j).getInt(
										MsgConstants.MC_FEC_NAC)));
								writer.append(';');
								writer.append('\n');
							}
						}
					} else {
						writer.append("N");
						writer.append(';');
						writer.append('\n');
					}
				} else {
					// Tiene conyuge
					if (jsonOpe.getString("DA1_DOM").equalsIgnoreCase("1")) {
						writer.append("S");
						writer.append(';');
						// Persona Conyuge
						Integer indPerCon = getPerIndex("C", jarrPers);
						writer.append(jarrPers.getJSONObject(indPerCon).getString("NOM_PER"));
						writer.append(';');
						writer.append(jarrPers.getJSONObject(indPerCon).getString("APE_PER"));
						writer.append(';');
						writer.append(jarrPers.getJSONObject(indPerCon).getString("NRO_DOC"));
						writer.append(';');
						writer.append(UtilFormat.setNumberToDate(jarrPers.getJSONObject(indPerCon).getInt(
								MsgConstants.MC_FEC_NAC)));
					} else {
						writer.append("N");
					}
					writer.append(';');
					writer.append('\n');
				}
			}
		}
		return writer;
	}

	private Integer getPerIndex(final String claPer, final JSONArray jarrSoliPer) {
		Integer ret = -1;
		for (int i = 0; i < jarrSoliPer.length(); i++) {
			if (jarrSoliPer.getJSONObject(i).getString(MsgConstants.MC_CLA_PER).equalsIgnoreCase(claPer)) {
				ret = i;
				break;
			}
		}
		return ret;
	}

	private Boolean getSepTieneFam(final JSONArray jarrPers) {
		for (int i = 0; i < jarrPers.length(); i++) {
			if (jarrPers.getJSONObject(i).getString(MsgConstants.MC_CLA_PER).equalsIgnoreCase("F")) {
				return true;
			}
		}
		return false;
	}

	private String getSepParentesco(final String parentesco) {
		String ret = "";
		Integer intPar = 0;
		try {
			intPar = Integer.parseInt(parentesco);
		} catch (Exception ex) {
			intPar = 0;
		}
		switch (intPar) {
		case 50:
			ret = "CONYUGE";
			break;
		case 2:
			ret = "HIJO MENOR DE 25";
			break;
		case 100:
		case 101:
			ret = "PADRE/SUEGRO";
			break;
		default:
			ret = parentesco;
		}
		return ret;
	}
}
