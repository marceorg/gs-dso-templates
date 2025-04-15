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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;

import com.hsbc.hbar.filerepo.model.common.AuthorizedUser;
import com.hsbc.hbar.filerepo.model.constant.FRConstants;
import com.hsbc.hbar.filerepo.model.enums.DestinationEnum;
import com.hsbc.hbar.filerepo.model.enums.MdwEnum;
import com.hsbc.hbar.filerepo.service.MdwService;
import com.hsbc.hbar.filerepo.service.OperationService;
import com.hsbc.hbar.filerepo.service.UserValidationService;
import com.hsbc.hbar.filerepo.service.utils.UtilFormat;

public class OperationServiceImpl implements OperationService {
	static Logger logger = LogManager.getLogger(OperationServiceImpl.class);

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

	public String getSolicitudList(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "L")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			}
			try {
				JSONObject request = new JSONObject();
				request.put("COD_PRO", producto);
				request.put("NRO_SOL", solicitud);
				if (solicitud.equals(Long.parseLong("0"))) {
					request.put("COD_PER", au.getProfileKey());
				} else {
					request.put("COD_PER", "");
				}
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SOLICITUD_SEL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getSolFiltroList(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud, final String propuesta, final Integer fase, final Integer estado, final Integer otro,
			final String oficina, final String asesor, final Long fechaIngDesde, final Long fechaIngHasta,
			final Long fechaManDesde, final Long fechaManHasta, final Integer asegTipDoc, final String asegNroDoc,
			final String asegApellido, final String asegNombre) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
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
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String setSolicitud(final HttpServletRequest httpServletRequest, final Integer cache, final Integer tipoCambio,
			final String producto, final Long solicitud, final Integer estado, final Integer otroCod,
			final String observaciones) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "L")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			} else if (estado.equals(2) || estado.equals(3) || estado.equals(4) || estado.equals(5) || estado.equals(6)) {
				// Estados (2) En Curso - (3) Verificado
				// (4) Derivado - (5)Pendiente - (6) Anulado
				if (!getUserValidationService().getSolicitudGrant(producto, solicitud.toString(), au.getProfileKey(),
						au.getPeopleSoft())) {
					return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_SNA + "\"}";
				} else if (estado.equals(4)
						&& !getUserValidationService().getSolicVerGrant(producto, solicitud.toString(), otroCod.toString())) {
					// Estado (4) Derivado
					return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_VNA + "\"}";
				}
			}
			try {
				JSONObject request = new JSONObject();
				request.put("TIP_CAM", tipoCambio);
				request.put("COD_PRO", producto);
				request.put("NRO_SOL", solicitud);
				request.put("COD_EST", estado);
				request.put("COD_OTR", otroCod);
				request.put("COD_USU", au.getPeopleSoft());
				request.put("APE_USU", au.getlName());
				request.put("NOM_USU", au.getfName());
				request.put("NRO_PRO", "");
				request.put("NRO_POL", "");
				request.put("OBS_SOL", UtilFormat.getValChars(observaciones));
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SOLICITUD_UPD,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getArchivoXSolList(final HttpServletRequest httpServletRequest, final Integer cache,
			final String producto, final Long solicitud, final Long archivo) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "L")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			}
			try {
				JSONObject request = new JSONObject();
				request.put("COD_PRO", producto);
				request.put("NRO_SOL", solicitud);
				request.put("NRO_ARC", archivo);
				request.put("ARC_FIR", "N");
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCXSOL_SEL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getArcFiltroList(final HttpServletRequest httpServletRequest, final Integer cache, final Integer tipoDoc,
			final String tipoArchivo, final Integer arcTipDoc, final String arcNroDoc, final String arcDato1,
			final String arcDato2, final String arcDato3, final String arcDato4, final Long fechaIngDesde,
			final Long fechaIngHasta) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			try {
				JSONObject request = new JSONObject();
				request.put("COD_TDO", tipoDoc);
				request.put("TIP_ARC", tipoArchivo);
				request.put("ARC_TDO", arcTipDoc);
				request.put("ARC_NDO", arcNroDoc);
				request.put("ARC_DA1", arcDato1);
				request.put("ARC_DA2", arcDato2);
				request.put("ARC_DA3", arcDato3);
				request.put("ARC_DA4", arcDato4);
				request.put("FIN_DES", fechaIngDesde);
				request.put("FIN_HAS", fechaIngHasta);
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCXSOL_FIL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String delArchivoXSol(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud, final Long archivo, final String observaciones) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!getUserValidationService().getUserFileGrant(producto, solicitud.toString(), archivo.toString(),
					au.getPeopleSoft())) {
				if (!getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "B")) {
					return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
				} else if (!getUserValidationService().getSolicitudGrant(producto, solicitud.toString(), au.getProfileKey(),
						au.getPeopleSoft())) {
					return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_SNA + "\"}";
				} else if (!getUserValidationService().getTipoDocumGrant(producto, solicitud.toString(), archivo.toString(),
						au.getPeopleSoft())) {
					return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_TNA + "\"}";
				}
			} else {
				if (!getUserValidationService().getSolicitudGrant(producto, solicitud.toString(), au.getProfileKey(),
						au.getPeopleSoft())) {
					return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_SNA + "\"}";
				}
			}
			try {
				JSONObject request = new JSONObject();
				request.put("COD_PRO", producto);
				request.put("NRO_SOL", solicitud);
				request.put("NRO_ARC", archivo);
				request.put("COD_USU", au.getPeopleSoft());
				request.put("APE_USU", au.getlName());
				request.put("NOM_USU", au.getfName());
				request.put("OBS_ARC", UtilFormat.getValChars(observaciones));
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCXSOL_DEL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getHisSolicitudList(final HttpServletRequest httpServletRequest, final Integer cache,
			final String producto, final Long solicitud) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "L")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			}
			try {
				JSONObject request = new JSONObject();
				request.put("COD_PRO", producto);
				request.put("NRO_SOL", solicitud);
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_HIS_SOLICITUD_SEL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getRetDocPendList(final HttpServletRequest httpServletRequest, final Integer cache, final String propuesta) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			try {
				// Parsear Propuesta
				String ramopCod = "";
				Integer polizAnn = 0;
				Integer polizSec = 0;
				Integer certiPol = 0;
				Integer certiAnn = 0;
				Integer certiSec = 0;
				Integer supleNum = 0;
				String[] arrPropuesta = propuesta.split("-");
				if (arrPropuesta.length == 6) {
					ramopCod = arrPropuesta[0];
					polizAnn = Integer.parseInt(arrPropuesta[1]);
					polizSec = Integer.parseInt(arrPropuesta[2]);
					certiPol = Integer.parseInt(arrPropuesta[3]);
					certiAnn = Integer.parseInt(arrPropuesta[4]);
					certiSec = Integer.parseInt(arrPropuesta[5]);
					// supleNum = Integer.parseInt(arrPropuesta[6]);
				}
				// Parametros servicio
				JSONObject request = new JSONObject();
				request.put("CIAASCOD", "0020");
				request.put("RAMOPCOD", ramopCod);
				request.put("POLIZANN", polizAnn);
				request.put("POLIZSEC", polizSec);
				request.put("CERTIPOL", certiPol);
				request.put("CERTIANN", certiAnn);
				request.put("CERTISEC", certiSec);
				request.put("ENDOSO", supleNum);
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.MQ,
						MdwEnum.MQ_1111_MOTIVOS_OP_PENDIENTES, request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getBatchLogList(final HttpServletRequest httpServletRequest, final Integer cache, final Integer fecha) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			try {
				JSONObject request = new JSONObject();
				request.put("FEC_BTC", fecha);
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_BTC_LOGPROC_SEL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getSolicitCklList(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "L")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			}
			try {
				JSONObject request = new JSONObject();
				request.put("COD_PRO", producto);
				request.put("NRO_SOL", solicitud);
				if (solicitud.equals(Long.parseLong("0"))) {
					request.put("COD_PER", au.getProfileKey());
				} else {
					request.put("COD_PER", "");
				}
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SOLICKL_SEL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String setSolicitCkl(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud, final Integer fase, final Integer ordenCkl, final String datoCkl) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "L")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			} else {
				if (!getUserValidationService().getSolicitudGrant(producto, solicitud.toString(), au.getProfileKey(),
						au.getPeopleSoft())) {
					return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_SNA + "\"}";
				}
			}
			try {
				JSONObject request = new JSONObject();
				request.put("COD_PRO", producto);
				request.put("NRO_SOL", solicitud);
				request.put("COD_FAS", fase);
				request.put("ORD_CKL", ordenCkl);
				request.put("DAT_CKL", UtilFormat.getValChars(datoCkl));
				request.put("COD_USU", au.getPeopleSoft());
				request.put("APE_USU", au.getlName());
				request.put("NOM_USU", au.getfName());
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SOLICKL_UPD,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String setSolicitTSo(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud, final String tipSol) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "L")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			} else {
				if (!getUserValidationService().getSolicitudGrant(producto, solicitud.toString(), au.getProfileKey(),
						au.getPeopleSoft())) {
					return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_SNA + "\"}";
				}
			}
			try {
				JSONObject request = new JSONObject();
				request.put("COD_PRO", producto);
				request.put("NRO_SOL", solicitud);
				request.put("TIP_SOL", tipSol);
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SOLICITUD_TSO,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String setSolicitFas(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long solicitud, final Integer fase, final String observaciones) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "L")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			} else {
				if (!getUserValidationService().getSolicitudGrant(producto, solicitud.toString(), au.getProfileKey(),
						au.getPeopleSoft())) {
					return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_SNA + "\"}";
				}
			}
			try {
				JSONObject request = new JSONObject();
				request.put("COD_PRO", producto);
				request.put("NRO_SOL", solicitud);
				request.put("COD_FAS", fase);
				request.put("COD_USU", au.getPeopleSoft());
				request.put("APE_USU", au.getlName());
				request.put("NOM_USU", au.getfName());
				request.put("OBS_SOL", observaciones);
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SOLIVERIF_INS,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getSiniestroList(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			JSONObject request = new JSONObject();
			request.put("NRO_OPE", operacion);
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SINIESTRO_SEL,
					request.toString());
			return response;
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getSinFiltroList(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final String producto, final String poliza, final Integer estado, final Long fechaIngDesde,
			final Long fechaIngHasta, final Long fechaManDesde, final Long fechaManHasta, final Integer asegTipDoc,
			final String asegNroDoc, final String asegApellido, final String asegNombre, final Integer tomaTipDoc,
			final String tomaNroDoc, final String tomaApellido, final String tomaNombre, final Integer denuTipDoc,
			final String denuNroDoc, final String denuApellido, final String denuNombre) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
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
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String setSiniestro(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Integer estado, final String observaciones) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			try {
				JSONObject request = new JSONObject();
				request.put("NRO_OPE", operacion);
				request.put("COD_EST", estado);
				request.put("COD_USU", au.getPeopleSoft());
				request.put("APE_USU", au.getlName());
				request.put("NOM_USU", au.getfName());
				request.put("OBS_OPE", UtilFormat.getValChars(observaciones));
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_SINIESTRO_UPD,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getArchivoXSinList(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Long archivo) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "L")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			}
			try {
				JSONObject request = new JSONObject();
				request.put("NRO_OPE", operacion);
				request.put("NRO_ARC", archivo);
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCXSIN_SEL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String setArchivoXSin(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Long archivo, final String observaciones) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			try {
				JSONObject request = new JSONObject();
				request.put("NRO_OPE", operacion);
				request.put("NRO_ARC", archivo);
				request.put("COD_USU", au.getPeopleSoft()); // No se manda
				request.put("APE_USU", au.getlName()); // No se manda
				request.put("NOM_USU", au.getfName()); // No se manda
				request.put("OBS_ARC", UtilFormat.getValChars(observaciones));
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCXSIN_UPD,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String delArchivoXSin(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Long archivo, final String observaciones) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			try {
				JSONObject request = new JSONObject();
				request.put("NRO_OPE", operacion);
				request.put("NRO_ARC", archivo);
				request.put("COD_USU", au.getPeopleSoft());
				request.put("APE_USU", au.getlName());
				request.put("NOM_USU", au.getfName());
				request.put("OBS_ARC", UtilFormat.getValChars(observaciones));
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCXSIN_DEL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getDDBenefList(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			JSONObject request = new JSONObject();
			request.put("NRO_OPE", operacion);
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_BENEFIC_SEL,
					request.toString());
			return response;
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getDBeFiltroList(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final String producto, final String poliza, final Integer estado, final Long fechaIngDesde,
			final Long fechaIngHasta, final Long fechaManDesde, final Long fechaManHasta, final Integer asegTipDoc,
			final String asegNroDoc, final String asegApellido, final String asegNombre, final Integer tomaTipDoc,
			final String tomaNroDoc, final String tomaApellido, final String tomaNombre) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
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
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_BENEFIC_FIL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String setDDBenef(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Integer estado, final String observaciones) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			try {
				JSONObject request = new JSONObject();
				request.put("NRO_OPE", operacion);
				request.put("COD_EST", estado);
				request.put("COD_USU", au.getPeopleSoft());
				request.put("APE_USU", au.getlName());
				request.put("NOM_USU", au.getfName());
				request.put("OBS_OPE", UtilFormat.getValChars(observaciones));
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_BENEFIC_UPD,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getArchivoXDBeList(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Long archivo) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "L")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			}
			try {
				JSONObject request = new JSONObject();
				request.put("NRO_OPE", operacion);
				request.put("NRO_ARC", archivo);
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCXBEN_SEL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String delArchivoXDBe(final HttpServletRequest httpServletRequest, final Integer cache, final Long operacion,
			final Long archivo, final String observaciones) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			try {
				JSONObject request = new JSONObject();
				request.put("NRO_OPE", operacion);
				request.put("NRO_ARC", archivo);
				request.put("COD_USU", au.getPeopleSoft());
				request.put("APE_USU", au.getlName());
				request.put("NOM_USU", au.getfName());
				request.put("OBS_ARC", UtilFormat.getValChars(observaciones));
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCXBEN_DEL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getRetColList(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long operacion) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			JSONObject request = new JSONObject();
			request.put("COD_PRO", producto);
			request.put("NRO_OPE", operacion);
			String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_RETCOL_SEL,
					request.toString());
			return response;
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getRCoFiltroList(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long operacion, final String poliza, final Integer estado, final Long fechaIngDesde,
			final Long fechaIngHasta, final Long fechaManDesde, final Long fechaManHasta, final Integer asegTipDoc,
			final String asegNroDoc, final String asegApellido, final String asegNombre, final Integer tomaTipDoc,
			final String tomaNroDoc, final String tomaApellido, final String tomaNombre, final String reqAdic) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			try {
				JSONObject request = new JSONObject();
				request.put("COD_PRO", producto);
				request.put("NRO_OPE", operacion);
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
				request.put("REQ_ADI", reqAdic);
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_RETCOL_FIL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String setRetCol(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long operacion, final Integer estado, final String observaciones) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			try {
				JSONObject request = new JSONObject();
				request.put("COD_PRO", producto);
				request.put("NRO_OPE", operacion);
				request.put("COD_EST", estado);
				request.put("COD_USU", au.getPeopleSoft());
				request.put("APE_USU", au.getlName());
				request.put("NOM_USU", au.getfName());
				request.put("OBS_OPE", UtilFormat.getValChars(observaciones));
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_RETCOL_UPD,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String getArchivoXRCoList(final HttpServletRequest httpServletRequest, final Integer cache,
			final String producto, final Long operacion, final Long archivo, final String ideArch) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			if (!getUserValidationService().getPermissionGrant(au.getProfileKey(), au.getProfileType(), "L")) {
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNA + "\"}";
			}
			try {
				JSONObject request = new JSONObject();
				request.put("COD_PRO", producto);
				request.put("NRO_OPE", operacion);
				request.put("NRO_ARC", archivo);
				request.put("IDE_ARC", ideArch);
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCXRCO_SEL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}

	public String delArchivoXRCo(final HttpServletRequest httpServletRequest, final Integer cache, final String producto,
			final Long operacion, final Long archivo, final String observaciones) {
		HttpSession session = httpServletRequest.getSession();
		AuthorizedUser au = (AuthorizedUser) session.getAttribute("authorizedUser");
		if (au != null) {
			try {
				JSONObject request = new JSONObject();
				request.put("COD_PRO", producto);
				request.put("NRO_OPE", operacion);
				request.put("NRO_ARC", archivo);
				request.put("COD_USU", au.getPeopleSoft());
				request.put("APE_USU", au.getlName());
				request.put("NOM_USU", au.getfName());
				request.put("OBS_ARC", UtilFormat.getValChars(observaciones));
				String response = this.getMdwService().getInsSvcGen(DestinationEnum.SP, MdwEnum.SP_FR_OPE_ARCXRCO_DEL,
						request.toString());
				return response;
			} catch (Exception e) {
				OperationServiceImpl.logger.error(e);
				return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_EXE + "\"}";
			}
		} else {
			return "{\"Message\":\"\",\"Code\":\"" + FRConstants.FR_SER_UNF + "\"}";
		}
	}
}
