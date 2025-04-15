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

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.hsbc.hbar.filerepo.dao.ParametersDao;
import com.hsbc.hbar.filerepo.model.constant.FRConstants;
import com.hsbc.hbar.filerepo.model.constant.MsgConstants;
import com.hsbc.hbar.filerepo.model.enums.DestinationEnum;
import com.hsbc.hbar.filerepo.model.enums.MdwEnum;
import com.hsbc.hbar.filerepo.service.BatchService;
import com.hsbc.hbar.filerepo.service.MdwService;
import com.hsbc.hbar.filerepo.service.UtilCommService;

public class BatchServiceImpl implements BatchService {
	static Logger logger = LogManager.getLogger(BatchServiceImpl.class);

	private ParametersDao parametersDao;
	private MdwService mdwService;
	private UtilCommService utilCommService;

	public ParametersDao getParametersDao() {
		if (this.parametersDao == null) {
			this.parametersDao = (ParametersDao) ServiceFactory.getContext().getBean("ParametersDao");
		}
		return this.parametersDao;
	}

	public void setParametersDao(final ParametersDao parametersDao) {
		this.parametersDao = parametersDao;
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

	public UtilCommService getUtilCommService() {
		if (this.utilCommService == null) {
			this.utilCommService = (UtilCommService) ServiceFactory.getContext().getBean("UtilCommService");
		}
		return this.utilCommService;
	}

	public void setUtilCommService(final UtilCommService utilCommService) {
		this.utilCommService = utilCommService;
	}

	public Boolean setBatchProcess(final String insKey) {
		// Validate Insurance Key
		if (!this.getParametersDao().getParamGral("INSSVCKEY").equalsIgnoreCase(insKey)) {
			return null;
		}
		// Servicio
		// Validacion de Host (Para que corra solo en uno)
		String hostNamePar = this.getParametersDao().getParamGral("BFRDESSRV");
		String hostNameAct = "";
		try {
			hostNameAct = InetAddress.getLocalHost().getHostName();
		} catch (UnknownHostException e) {
			BatchServiceImpl.logger.error(e);
		}
		BatchServiceImpl.logger.info("Host Parameter: {}", hostNamePar);
		BatchServiceImpl.logger.info("Host System: {}", hostNameAct);
		if (!hostNameAct.equalsIgnoreCase(hostNamePar)) {
			return false;
		}
		// Inicio del proceso
		setBatchLog(10, "INICIO DEL PROCESO");
		setBatchEmi(20);
		setBatchPen(30);
		setBatchDep(40);
		// Fin del proceso
		setBatchLog(50, "FIN DEL PROCESO");
		return true;
	}

	private void setBatchEmi(final Integer paso) {
		setBatchLog(paso, "Inicio del Paso - EMISION(E)");
		String response = getSolBatchList("E");
		JSONObject responseSvc = new JSONObject(response);
		if (!responseSvc.has("Code")) {
			setBatchLog(paso, "Resultado: FATAL_EXEC_ERROR");
		} else if (!responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
			setBatchLog(paso, responseSvc.getString("Code"));
		} else {
			if (responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
					.getJSONArray(MsgConstants.MC_REG).length() > 0) {
				JSONArray resSolArr = responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
						.getJSONArray(MsgConstants.MC_REG);
				for (int i = 0; i < resSolArr.length(); i++) {
					try {
						String producto = resSolArr.getJSONObject(i).getString("COD_PRO");
						Long solicitud = resSolArr.getJSONObject(i).getLong("NRO_SOL");
						setBatchLog(paso, "Solicitud: " + producto + "-" + solicitud.toString());
						// Verificar si se emitio
						String propuesta = resSolArr.getJSONObject(i).getString("NRO_PRO");
						String ramopCod = propuesta.substring(0, 4);
						String polizAnn = propuesta.substring(5, 7);
						String polizSec = propuesta.substring(8, 14);
						String certiPol = propuesta.substring(15, 19);
						String certiAnn = propuesta.substring(20, 24);
						String certiSec = propuesta.substring(25, 31);
						// String supleNum = propuesta.substring(32, 36);
						String ciaascod = "0020";
						if (producto.substring(0, 1).equalsIgnoreCase("R")) {
							ciaascod = "0015";
						}
						JSONObject requestEmi = new JSONObject();
						requestEmi.put("CIAASCOD", ciaascod);
						requestEmi.put("RAMOPCOD", ramopCod);
						requestEmi.put("POLIZANN", Integer.parseInt(polizAnn));
						requestEmi.put("POLIZSEC", Integer.parseInt(polizSec));
						requestEmi.put("CERTIPOL", Integer.parseInt(certiPol));
						requestEmi.put("CERTIANN", Integer.parseInt(certiAnn));
						requestEmi.put("CERTISEC", Integer.parseInt(certiSec));
						// requestEmi.put("SUPLENUM", supleNum);
						String responseEmi = this.getMdwService().getInsSvcGen(DestinationEnum.MQ,
								MdwEnum.MQ_1161_SOLICITUD_ESTADO, requestEmi.toString());
						JSONObject resSvcEmi = new JSONObject(responseEmi);
						if (!resSvcEmi.has("Code")) {
							setBatchLog(paso, "Resultado: FATAL_EXEC_ERROR");
						} else if (!resSvcEmi.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
							setBatchLog(paso, resSvcEmi.getString("Code"));
						} else {
							if (resSvcEmi.getJSONObject(MsgConstants.MC_MSG).getJSONObject("CAMPOS").length() > 0) {
								JSONObject resSolEmi = resSvcEmi.getJSONObject(MsgConstants.MC_MSG).getJSONObject("CAMPOS");
								if (resSolEmi.getString("ESTADO").equalsIgnoreCase("02")) {
									// 02 - No encontrada
									setBatchLog(paso, "Resultado: NO_ENCONTRADA");
								} else if (resSolEmi.getString("ESTADO").equalsIgnoreCase("03")) {
									// 03 - Pendiente
									setBatchLog(paso, "Resultado: PENDIENTE");
								} else if (resSolEmi.getString("ESTADO").equalsIgnoreCase("01")
										|| resSolEmi.getString("ESTADO").equalsIgnoreCase("04")) {
									// 01 - Emitida o 04 - Rechazada
									JSONObject requestUpd = new JSONObject();
									if (resSolEmi.getString("ESTADO").equalsIgnoreCase("01")) {
										Integer pAnn = resSolEmi.getInt("POLIZANN");
										Integer pSec = resSolEmi.getInt("POLIZSEC");
										String poliza = ramopCod + "-" + String.format("%02d", pAnn) + "-"
												+ String.format("%06d", pSec);
										// + "-" + supleNum;
										// Si se emitio
										requestUpd.put("TIP_CAM", 8);
										requestUpd.put("COD_PRO", producto);
										requestUpd.put("NRO_SOL", solicitud);
										requestUpd.put("COD_EST", 8);
										requestUpd.put("COD_OTR", 0);
										requestUpd.put("COD_USU", "");
										requestUpd.put("APE_USU", "");
										requestUpd.put("NOM_USU", "");
										requestUpd.put("NRO_PRO", "");
										requestUpd.put("NRO_POL", poliza);
										requestUpd.put("OBS_SOL", "");
										setBatchLog(paso, "Proceso: MARCAR_EMITIDA");
									} else if (resSolEmi.getString("ESTADO").equalsIgnoreCase("04")) {
										// Si se rechazo
										requestUpd.put("TIP_CAM", 9);
										requestUpd.put("COD_PRO", producto);
										requestUpd.put("NRO_SOL", solicitud);
										requestUpd.put("COD_EST", 9);
										requestUpd.put("COD_OTR", 0);
										requestUpd.put("COD_USU", "");
										requestUpd.put("APE_USU", "");
										requestUpd.put("NOM_USU", "");
										requestUpd.put("NRO_PRO", "");
										requestUpd.put("NRO_POL", "");
										requestUpd.put("OBS_SOL", "");
										setBatchLog(paso, "Proceso: MARCAR_RECHAZADA");
									}
									String responseUpd = this.getMdwService().getInsSvcGen(DestinationEnum.SP,
											MdwEnum.SP_FR_OPE_SOLICITUD_UPD, requestUpd.toString());
									JSONObject resSvcUpd = new JSONObject(responseUpd);
									if (!resSvcUpd.has("Code")) {
										setBatchLog(paso, "Resultado: FATAL_EXEC_ERROR");
									} else if (!resSvcEmi.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
										setBatchLog(paso, resSvcEmi.getString("Code"));
									} else {
										setBatchLog(paso, "Resultado: OK");
									}
								} else {
									// Otro
									setBatchLog(paso, "Resultado: ERROR_RESPONSE");
								}
							} else {
								setBatchLog(paso, "Resultado: NO_RESPONSE");
							}
						}
					} catch (Exception e) {
						BatchServiceImpl.logger.error(e);
						setBatchLog(paso, e.getMessage());
					}
				}
				setBatchLog(paso, "Resultado: OK");
			} else {
				setBatchLog(paso, "Resultado: NO_REGS");
			}
		}
		setBatchLog(paso, "Fin del Paso - EMISION(E)");
	}

	private void setBatchPen(final Integer paso) {
		setBatchLog(paso, "Inicio del Paso - PENDIENTES(P)");
		String response = getSolBatchList("P");
		JSONObject responseSvc = new JSONObject(response);
		if (!responseSvc.has("Code")) {
			setBatchLog(paso, "Resultado: FATAL_EXEC_ERROR");
		} else if (!responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
			setBatchLog(paso, responseSvc.getString("Code"));
		} else {
			if (responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
					.getJSONArray(MsgConstants.MC_REG).length() > 0) {
				JSONArray resSolArr = responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
						.getJSONArray(MsgConstants.MC_REG);
				String urlApp = this.getParametersDao().getParamGral("BFRURLAPP");
				String recipientTO = "";
				String recipientsCC = "";
				String recipientsBCC = "";
				StringBuilder soliBuf = new StringBuilder();
				for (int i = 0; i < resSolArr.length(); i++) {
					String producto = resSolArr.getJSONObject(i).getString("COD_PRO");
					Long solicitud = resSolArr.getJSONObject(i).getLong("NRO_SOL");
					String estado = resSolArr.getJSONObject(i).getString("DES_EST");
					String otro = resSolArr.getJSONObject(i).getString("DES_OTR");
					String usuCod = resSolArr.getJSONObject(i).getString("UMA_COD");
					String usuApe = resSolArr.getJSONObject(i).getString("UMA_APE");
					String usuNom = resSolArr.getJSONObject(i).getString("UMA_NOM");
					Integer difDias = resSolArr.getJSONObject(i).getInt("DIF_DIA");
					String eMail = resSolArr.getJSONObject(i).getString("EMA_ALE");
					String eMailCC = resSolArr.getJSONObject(i).getString("EMA_ACC");
					String eMailCCO = resSolArr.getJSONObject(i).getString("EMA_ACO");
					setBatchLog(paso, "Solicitud: " + producto + "-" + solicitud.toString());
					// Si no tiene email lo descarto
					if (!eMail.equalsIgnoreCase("")) {
						if (recipientTO.equalsIgnoreCase("")) {
							recipientTO = eMail;
						}
						// Agrego la solicitud
						soliBuf.append("La solicitud " + producto + "-" + solicitud.toString() + " lleva "
								+ difDias.toString() + " dias en estado " + estado
								+ (otro.equalsIgnoreCase("") ? "" : " (" + otro + ")")
								+ " sin ningun movimiento. Ultimo usuario (" + usuCod + ") " + usuApe + " " + usuNom
								+ ".\r\n");
						// Junto x EMail
						if (!recipientTO.equalsIgnoreCase(eMail)) {
							String bodyText = "Se le informa que:\n" + soliBuf.toString()
									+ "\nPor favor revisar en la aplicacion FileRepo." + "\n" + urlApp + "\n";
							Boolean resMail = this.getUtilCommService().sendPdfReport(null, recipientTO, recipientsCC,
									recipientsBCC, "", "", "FileRepo<filerepo@galiciamas.com.ar>", "", bodyText,
									"Solicitudes sin movimientos");
							setBatchLog(paso, "Envio a: " + recipientTO + " - Resultado: " + resMail.toString());
							recipientTO = eMail;
							recipientsCC = eMailCC;
							recipientsBCC = eMailCCO;
							soliBuf = new StringBuilder();
						}
					} else {
						setBatchLog(paso, "Resultado: NO_EMAIL");
					}
				}
				// Junto x EMail
				if (!recipientTO.equalsIgnoreCase("")) {
					String bodyText = "Se le informa que:\n" + soliBuf.toString()
							+ "\nPor favor, revisar en la aplicacion FileRepo." + "\n" + urlApp + "\n";
					Boolean resMail = this.getUtilCommService().sendPdfReport(null, recipientTO, recipientsCC,
							recipientsBCC, "", "", "FileRepo<filerepo@galiciamas.com.ar>", "", bodyText,
							"Solicitudes sin movimientos");
					setBatchLog(paso, "Envio a: " + recipientTO + " - Resultado: " + resMail.toString());
				}
				setBatchLog(paso, "Resultado: OK");
			} else {
				setBatchLog(paso, "Resultado: NO_REGS");
			}
		}
		setBatchLog(paso, "Fin del Paso - PENDIENTES(P)");
	}

	private void setBatchDep(final Integer paso) {
		setBatchLog(paso, "Inicio del Paso - DEPURACION(D)");
		String response = getSolBatchList("D");
		JSONObject responseSvc = new JSONObject(response);
		if (!responseSvc.has("Code")) {
			setBatchLog(paso, "Resultado: FATAL_EXEC_ERROR");
		} else if (!responseSvc.getString("Code").equalsIgnoreCase(FRConstants.FR_SER_NER)) {
			setBatchLog(paso, responseSvc.getString("Code"));
		} else {
			if (responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
					.getJSONArray(MsgConstants.MC_REG).length() > 0) {
				JSONArray resSolArr = responseSvc.getJSONObject(MsgConstants.MC_MSG).getJSONObject(MsgConstants.MC_RGS)
						.getJSONArray(MsgConstants.MC_REG);
				for (int i = 0; i < resSolArr.length(); i++) {
					String producto = resSolArr.getJSONObject(0).getString("COD_PRO");
					Long solicitud = resSolArr.getJSONObject(0).getLong("NRO_SOL");
					setBatchLog(paso, "Solicitud: " + producto + "-" + solicitud.toString());
				}
				setBatchLog(paso, "Resultado: OK");
			} else {
				setBatchLog(paso, "Resultado: NO_REGS");
			}
		}
		setBatchLog(paso, "Fin del Paso - DEPURACION(D)");
	}

	private String getSolBatchList(final String batch) {
		try {
			JSONObject request = new JSONObject();
			request.put("COD_BTC", batch);
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SOLICITUD_BTC,
					request.toString());
			return response;
		} catch (Exception e) {
			BatchServiceImpl.logger.error(e);
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
		}
	}

	private void setBatchLog(final Integer paso, final String descripcion) {
		try {
			JSONObject request = new JSONObject();
			request.put("PAS_BTC", paso);
			request.put("DES_BTC", descripcion);
			this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_BTC_LOGPROC_INS, request.toString());
		} catch (Exception e) {
			BatchServiceImpl.logger.error(e);
		}
	}
}
