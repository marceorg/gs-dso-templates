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

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.hsbc.hbar.filerepo.model.common.AuthorizedUser;
import com.hsbc.hbar.filerepo.model.constant.FRConstants;
import com.hsbc.hbar.filerepo.model.enums.DestinationEnum;
import com.hsbc.hbar.filerepo.model.enums.MdwEnum;
import com.hsbc.hbar.filerepo.service.MdwService;
import com.hsbc.hbar.filerepo.service.ParametersService;
import com.hsbc.hbar.filerepo.service.utils.UtilFormat;

public class ParametersServiceImpl implements ParametersService {
	static Logger logger = LogManager.getLogger(ParametersServiceImpl.class);

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

	public Integer getFechaHoy(final Integer cache) {
		Date date = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
		String dateString = formatter.format(date);
		return Integer.parseInt(dateString);
	}

	public String getTipoDocumentalList(final Integer cache, final Integer tipoDoc, final Integer grupoDoc,
			final Boolean indBaja) {
		try {
			JSONObject request = new JSONObject();
			request.put("COD_TDO", tipoDoc);
			request.put("COD_GDO", grupoDoc);
			request.put("IND_BAJ", indBaja);
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_PAR_TIPODOC_SEL,
					request.toString());
			return response;
		} catch (Exception e) {
			ParametersServiceImpl.logger.error(e);
			return null;
		}
	}

	public String setTipoDocumental(final HttpServletRequest httpServletRequest, final Integer cache, final Integer tipoDoc,
			final String descripcion, final Integer grupoDoc, final Boolean indBaja, final Boolean indBorrado,
			final String codFileNet) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!au.getProfileKey().equalsIgnoreCase("A")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			}
			try {
				JSONObject request = new JSONObject();
				request.put("COD_TDO", tipoDoc);
				request.put("DES_TDO", UtilFormat.getValChars(descripcion));
				request.put("COD_GDO", grupoDoc);
				request.put("IND_BAJ", indBaja);
				request.put("IND_BOR", indBorrado);
				request.put("COD_FLN", UtilFormat.getValChars(codFileNet));
				request.put("COD_USU", au.getPeopleSoft());
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_PAR_TIPODOC_IUP,
						request.toString());
				return response;
			} catch (Exception e) {
				ParametersServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getGrupoDocumentalList(final Integer cache) {
		try {
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_PAR_GRUPODOC_SEL, "{}");
			return response;
		} catch (Exception e) {
			ParametersServiceImpl.logger.error(e);
			return null;
		}
	}

	public String getPerfilList(final Integer cache) {
		try {
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_PAR_PERFIL_SEL, "{}");
			return response;
		} catch (Exception e) {
			ParametersServiceImpl.logger.error(e);
			return null;
		}
	}

	public String getFaseList(final Integer cache, final String perfil, final String producto) {
		try {
			JSONObject request = new JSONObject();
			request.put("COD_PER", perfil);
			request.put("COD_PRO", producto);
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_PAR_FASE_SEL,
					request.toString());
			return response;
		} catch (Exception e) {
			ParametersServiceImpl.logger.error(e);
			return null;
		}
	}

	public String getEstadoList(final Integer cache, final Integer estadoActual) {
		try {
			JSONObject request = new JSONObject();
			request.put("EST_ACT", estadoActual);
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_PAR_ESTADO_SEL,
					request.toString());
			return response;
		} catch (Exception e) {
			ParametersServiceImpl.logger.error(e);
			return null;
		}
	}

	public String setPerfil(final HttpServletRequest httpServletRequest, final Integer cache, final String perfil,
			final Integer fase, final Boolean reqRevision, final Boolean pAnaLectura, final Boolean pAnaAlta,
			final Boolean pAnaBaja, final Boolean pSupLectura, final Boolean pSupAlta, final Boolean pSupBaja) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!au.getProfileKey().equalsIgnoreCase("A")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			}
			try {
				JSONObject request = new JSONObject();
				request.put("COD_PER", perfil);
				request.put("COD_FAS", fase);
				request.put("COD_USU", au.getPeopleSoft());
				request.put("REQ_REV", reqRevision);
				request.put("PAN_LEC", pAnaLectura);
				request.put("PAN_ALT", pAnaAlta);
				request.put("PAN_BAJ", pAnaBaja);
				request.put("PSU_LEC", pSupLectura);
				request.put("PSU_ALT", pSupAlta);
				request.put("PSU_BAJ", pSupBaja);
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_PAR_PERFIL_IUP,
						request.toString());
				return response;
			} catch (Exception e) {
				ParametersServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getTipoDocumentoList(final Integer cache) {
		try {
			JSONObject request = new JSONObject();
			request.put("COD_APP", "OV");
			request.put("COD_PRO", "");
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_PAROV_TIPOSDOC,
					request.toString());
			return response;
		} catch (Exception e) {
			ParametersServiceImpl.logger.error(e);
			return null;
		}
	}

	public String getPendMotivoList(final Integer cache) {
		try {
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_PAR_PENMOT_SEL, "{}");
			return response;
		} catch (Exception e) {
			ParametersServiceImpl.logger.error(e);
			return null;
		}
	}

	public String getAlertaXFaseList(final Integer cache, final Integer fase) {
		try {
			JSONObject request = new JSONObject();
			request.put("COD_FAS", fase);
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_PAR_ALEXFAS_SEL,
					request.toString());
			return response;
		} catch (Exception e) {
			ParametersServiceImpl.logger.error(e);
			return null;
		}
	}

	public String setAlertaXFase(final HttpServletRequest httpServletRequest, final Integer cache, final Integer fase,
			final String email, final String emailCC, final String emailCCO, final String jsonEstadoList) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!au.getProfileKey().equalsIgnoreCase("A")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			}
			try {
				JSONObject request = new JSONObject();
				request.put("COD_FAS", fase);
				request.put("EMA_REC", UtilFormat.getValChars(email));
				request.put("EMA_RCC", UtilFormat.getValChars(emailCC));
				request.put("EMA_RCO", UtilFormat.getValChars(emailCCO));
				request.put("COD_USU", au.getPeopleSoft());
				request.put("XML_AXE", getXMLEstadoList(UtilFormat.getValChars(jsonEstadoList)));
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_PAR_ALEXFAS_IUP,
						request.toString());
				return response;
			} catch (Exception e) {
				ParametersServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	private String getXMLEstadoList(final String jsonEstadoList) {
		try {
			JSONObject jsonEstObj = new JSONObject(jsonEstadoList);
			JSONArray jsonEstList = jsonEstObj.getJSONArray("estadoList");
			StringBuilder xmlEst = new StringBuilder();
			xmlEst.append("<XML_EST>");
			for (int i = 0; i < jsonEstList.length(); i++) {
				xmlEst.append("<REG");
				xmlEst.append(" CE=\"");
				xmlEst.append(jsonEstList.getJSONObject(i).getInt("cEst"));
				xmlEst.append("\"");
				xmlEst.append(" CD=\"");
				xmlEst.append(jsonEstList.getJSONObject(i).getInt("cDia"));
				xmlEst.append("\"");
				xmlEst.append("/>");
			}
			xmlEst.append("</XML_EST>");
			return xmlEst.toString();
		} catch (Exception e) {
			ParametersServiceImpl.logger.error(e);
			return "<XML_EST/>";
		}
	}

	public String getAlertaXEstadoList(final Integer cache, final Integer fase) {
		try {
			JSONObject request = new JSONObject();
			request.put("COD_FAS", fase);
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_PAR_ALEXEST_SEL,
					request.toString());
			return response;
		} catch (Exception e) {
			ParametersServiceImpl.logger.error(e);
			return null;
		}
	}
}
